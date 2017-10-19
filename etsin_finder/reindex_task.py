from .elasticsearch.elasticsearch_service import ElasticSearchService
from .elasticsearch.es_dataset_data_model import ESDatasetModel
from .metax_api import MetaxAPIService
import logging

log = logging.getLogger(__name__)


class ReindexTask:

    def __init__(self, app):
        self.app = app
        self.metax = MetaxAPIService(self.app)

        es_conf = self.app.config.get('ELASTICSEARCH', None)
        if not es_conf or not isinstance(es_conf, dict):
            log.error('Invalid elasticsearch configuration')
        else:
            self.es_client = ElasticSearchService(self.app, es_conf.get('HOSTS'), self._get_connection_parameters(es_conf))
            self.es_client.delete_index()
            if not self.es_client.index_exists():
                if self.es_client.create_index():
                    self.es_client.create_type_mapping()

    def init_reindex_scheduled_task(self):
        urn_ids_to_delete = []
        urn_ids_to_index = []

        # 1. Disable RabbitMQ consumer
        # Code here

        # 2. Get all dataset urn_identifiers from metax
        metax_urn_identifiers = self.metax.get_all_dataset_urn_identifiers()
        urn_ids_to_create = list(metax_urn_identifiers)

        # 3. Get all urn_identifiers from search index
        es_urn_identifiers = self.es_client.get_all_doc_ids_from_index() or []

        # 4.
        # If urn_id in metax and in ex index -> index
        # If urn_id in metax but not in es index -> index
        # If urn_id not in metax but in es index -> delete
        for es_urn_id in es_urn_identifiers:
            if es_urn_id in metax_urn_identifiers:
                urn_ids_to_index.append(es_urn_id)
                urn_ids_to_create.remove(es_urn_id)
            else:
                urn_ids_to_delete.append(es_urn_id)

        log.info("urn identifiers to delete: \n{0}".format(urn_ids_to_delete))
        log.info("urn identifiers to create: \n{0}".format(urn_ids_to_create))
        log.info("urn identifiers to update: \n{0}".format(urn_ids_to_index))
        urn_ids_to_index.extend(urn_ids_to_create)
        log.info("urn identifiers to exist (create or update): \n{0}".format(urn_ids_to_index))

        # 5. Run bulk requests to search index
        # A. Delete documents from index no longer in metax
        self.es_client.bulk_delete_data(urn_ids_to_delete)
        # B. Create or update documents that are either new or already exist in search index
        self.es_client.bulk_update_data(self._get_es_dataset_data_models(urn_ids_to_index))

        # 6. Enable RabbitMQ Consumer
        # Code here

    def _get_es_dataset_data_models(self, urn_identifiers_in_metax):
        es_dataset_data_models = []
        for urn_id_in_metax in urn_identifiers_in_metax:
            metax_dataset_json = self.metax.get_dataset(urn_id_in_metax)
            es_dataset_data_models.append(ESDatasetModel(self._convert_metax_dataset_json_to_es_dataset_data_model(metax_dataset_json)))

        return es_dataset_data_models

    def _convert_metax_dataset_json_to_es_dataset_data_model(self, metax_dataset_json):
        es_dataset = {}
        if metax_dataset_json.get('research_dataset', False) and metax_dataset_json.get('urn_identifier', False):
            m_rd = metax_dataset_json['research_dataset']
            es_dataset['urn_identifier'] = m_rd['urn_identifier']
            es_dataset['preferred_identifier'] = m_rd.get('preferred_identifier', '')
            es_dataset['modified_by_api'] = metax_dataset_json.get('modified_by_api', '')
            es_dataset['title'] = m_rd.get('title', {})
            es_dataset['description'] = m_rd.get('description', [])
            es_dataset['keyword'] = m_rd.get('keyword', [])
            es_dataset['preservation_state'] = metax_dataset_json.get('preservation_state', -1)

            es_dataset['other_identifier'] = []
            for m_other_identifier_item in m_rd.get('other_identifier', []):
                es_other_identifier = {}

                if m_other_identifier_item.get('notation'):
                    es_other_identifier['notation'] = m_other_identifier_item.get('notation')

                if m_other_identifier_item.get('type', False):
                    es_other_identifier['type'] = {}
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_other_identifier_item.get('type'), es_other_identifier['type'], 'pref_label')

                es_dataset['other_identifiers'].append(es_other_identifier)

            es_dataset['access_rights'] = {}
            if m_rd.get('access_rights', False):
                es_access_rights = es_dataset['access_rights']

                if m_rd.get('access_rights').get('license', False):
                    m_license = m_rd.get('access_rights').get('license')
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_license, es_access_rights, 'title', True, 'license')

                if m_rd.get('access_rights').get('type', False):
                    m_type = m_rd.get('access_rights').get('type')
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_type, es_access_rights, 'pref_label', False, 'type')

            es_dataset['theme'] = []
            if m_rd.get('theme', False):
                m_theme = m_rd.get('theme')
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_theme, es_dataset, 'pref_label', False, 'theme')

            es_dataset['field_of_science'] = []
            if m_rd.get('field_of_science', False):
                m_field_of_science = m_rd.get('field_of_science')
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_field_of_science, es_dataset, 'pref_label', False, 'field_of_science')

            es_dataset['project'] = []
            for m_is_output_of_item in m_rd.get('is_output_of', []):
                es_project = {}
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_is_output_of_item, es_project, 'name')

                if m_is_output_of_item.get('has_funding_agency', []):
                    self._convert_metax_org_or_person_to_es_model(m_is_output_of_item.get('has_funding_agency'),
                                                            es_project, 'has_funding_agency')

                if m_is_output_of_item.get('source_organization', []):
                    self._convert_metax_org_or_person_to_es_model(m_is_output_of_item.get('source_organization'),
                                                            es_project, 'source_organization')

                es_dataset['project'].append(es_project)

            es_dataset['contributor'] = []
            if m_rd.get('contributor', False):
                self._convert_metax_org_or_person_to_es_model(m_rd.get('contributor'), es_dataset, 'contributor')

            es_dataset['publisher'] = []
            if m_rd.get('publisher', False):
                self._convert_metax_org_or_person_to_es_model(m_rd.get('publisher'), es_dataset, 'publisher')

            es_dataset['curator'] = []
            if m_rd.get('curator', False):
                self._convert_metax_org_or_person_to_es_model(m_rd.get('curator'), es_dataset, 'curator')

            es_dataset['creator'] = []
            if m_rd.get('creator', False):
                self._convert_metax_org_or_person_to_es_model(m_rd.get('creator'), es_dataset, 'creator')

            es_dataset['rights_holder'] = []
            if m_rd.get('rights_holder', False):
                self._convert_metax_org_or_person_to_es_model(m_rd.get('rights_holder'), es_dataset, 'rights_holder')

        return es_dataset

    def _convert_metax_obj_containing_identifier_and_label_to_es_model(self, m_input, es_output, m_input_label_field,
                                                                      m_input_label_is_array=False, es_relation_name=''):
        """

        If m_input is not array, set identifier and label directly on es_output.
        If m_input is array, add a relation_name array relation to es_output, which will contain objects
        having identifier and label each

        :param m_input:
        :param es_output:
        :param m_input_label_field:
        :param m_input_label_is_array:
        :param es_relation_name:
        :return:
        """

        if isinstance(m_input, list) and es_relation_name:
            output = []
            for obj in m_input:
                out_obj = {
                    'identifier': obj.get('identifier', ''),
                    'label': obj.get(m_input_label_field, [] if m_input_label_is_array else {})
                }
                output.append(out_obj)
            es_output[es_relation_name] = output
        else:
            es_output['identifier'] = m_input.get('identifier'),
            es_output['label'] = m_input.get(m_input_label_field, {})


    def _convert_metax_org_or_person_to_es_model(self, m_input, es_output, relation_name):
        """

        :param m_input:
        :param es_output:
        :param relation_name:
        :return:
        """

        if isinstance(m_input, list):
            output = []
            for m_obj in m_input:
                output.append(self._get_converted_single_org_or_person_es_model(m_obj))
        else:
            output = {}
            if m_input:
                output = self._get_converted_single_org_or_person_es_model()

        es_output[relation_name] = output

    def _get_converted_single_org_or_person_es_model(self, m_obj):
        if not m_obj.get('@type') or m_obj.get('@type') in ['Person', 'Organization']:
            log.error("Skipping {0}".format(m_obj))
            return None

        out_obj = self._get_es_person_or_org_common_data_from_metax_obj(m_obj)

        agent_type = m_obj.get('@type')
        if agent_type == 'Person' and m_obj.get('member_of', False):
            out_obj.update({'belongs_to_org': self._get_es_person_or_org_common_data_from_metax_obj(m_obj.get('member_of'))})
        elif agent_type == 'Organization' and m_obj.get('is_part_of', False):
            out_obj.update({'belongs_to_org': self._get_es_person_or_org_common_data_from_metax_obj(m_obj.get('is_part_of'))})

        return out_obj

    def _get_es_person_or_org_common_data_from_metax_obj(self, m_obj):
        return {
            'identifier': m_obj.get('identifier', ''),
            'name': m_obj.get('name', ''),
            'email': m_obj.get('email', ''),
            'telephone': m_obj.get('telephone', ''),
            'agent_type': m_obj.get('@type'),
            'homepage': m_obj.get('homepage', {})
        }

    def _get_connection_parameters(self, settings):
        """
        https://docs.objectrocket.com/elastic_python_examples.html
        """
        if settings['HOSTS'][0] != 'localhost':
            conf = {'send_get_body_as': 'GET'}
            if settings.get('USE_SSL', False):
                conf.update({'port': 443, 'use_ssl': True, 'verify_certs': True})
            if settings.get('PORT', False):
                conf.update({'port': 9200})
            return conf
        return {}