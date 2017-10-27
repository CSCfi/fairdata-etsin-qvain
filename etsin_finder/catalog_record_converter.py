from etsin_finder.elasticsearch.es_dataset_data_model import ESDatasetModel
# from etsin_finder.utils import write_json_to_file


class CRConverter:

    def convert_metax_cr_urn_ids_to_es_data_model(self, urn_identifiers_in_metax, metax_api):
        es_dataset_data_models = []
        for urn_id_in_metax in urn_identifiers_in_metax:
            es_dataset_data_models.append(self._convert_metax_cr_urn_id_to_es_data_model(urn_id_in_metax, metax_api))

        return es_dataset_data_models

    def _convert_metax_cr_urn_id_to_es_data_model(self, urn_identifier_in_metax, metax_api):
        metax_catalog_record_json = metax_api.get_catalog_record(urn_identifier_in_metax)
        es_dataset_json = self.convert_metax_catalog_record_json_to_es_data_model(metax_catalog_record_json)
        return ESDatasetModel(es_dataset_json)

    def convert_metax_catalog_record_json_to_es_data_model(self, metax_cr_json):
        es_dataset = {}
        if metax_cr_json.get('research_dataset', False) and \
                metax_cr_json.get('research_dataset').get('urn_identifier', False):

            m_rd = metax_cr_json['research_dataset']
            es_dataset['urn_identifier'] = m_rd['urn_identifier']
            es_dataset['preferred_identifier'] = m_rd.get('preferred_identifier', '')

            if metax_cr_json.get('modified_by_api', False):
                es_dataset['modified_by_api'] = metax_cr_json.get('modified_by_api')

            if m_rd.get('title', False):
                es_dataset['title'] = m_rd.get('title')

            if m_rd.get('description', False):
                es_dataset['description'] = m_rd.get('description')

            if m_rd.get('keyword', False):
                es_dataset['keyword'] = m_rd.get('keyword')

            if metax_cr_json.get('preservation_state', False):
                es_dataset['preservation_state'] = metax_cr_json.get('preservation_state')

            for m_other_identifier_item in m_rd.get('other_identifier', []):
                if 'other_identifier' not in es_dataset:
                    es_dataset['other_identifier'] = []

                es_other_identifier = {}

                if m_other_identifier_item.get('notation'):
                    es_other_identifier['notation'] = m_other_identifier_item.get('notation')

                if m_other_identifier_item.get('type', False):
                    es_other_identifier['type'] = {}
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(
                        m_other_identifier_item.get('type'), es_other_identifier['type'], 'pref_label')

                es_dataset['other_identifier'].append(es_other_identifier)

            if m_rd.get('access_rights', False):
                if 'access_rights' not in es_dataset:
                    es_dataset['access_rights'] = {}

                es_access_rights = es_dataset['access_rights']

                if m_rd.get('access_rights').get('license', False):
                    m_license = m_rd.get('access_rights').get('license')
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_license, es_access_rights,
                                                                                        'title', True, 'license')

                if m_rd.get('access_rights').get('type', False):
                    m_type = m_rd.get('access_rights').get('type')
                    self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_type, es_access_rights,
                                                                                        'pref_label', False, 'type')

            if m_rd.get('theme', False):
                if 'theme' not in es_dataset:
                    es_dataset['theme'] = []

                m_theme = m_rd.get('theme')
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_theme, es_dataset, 'pref_label',
                                                                                    False, 'theme')

            if m_rd.get('field_of_science', False):
                if 'field_of_science' not in es_dataset:
                    es_dataset['field_of_science'] = []

                m_field_of_science = m_rd.get('field_of_science')
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_field_of_science, es_dataset,
                                                                                    'pref_label', False,
                                                                                    'field_of_science')

            for m_is_output_of_item in m_rd.get('is_output_of', []):
                if 'project' not in es_dataset:
                    es_dataset['project'] = []

                es_project = {}
                self._convert_metax_obj_containing_identifier_and_label_to_es_model(m_is_output_of_item, es_project,
                                                                                    'name')

                if m_is_output_of_item.get('has_funding_agency', []):
                    self._convert_metax_org_or_person_to_es_model(m_is_output_of_item.get('has_funding_agency'),
                                                                  es_project, 'has_funding_agency')

                if m_is_output_of_item.get('source_organization', []):
                    self._convert_metax_org_or_person_to_es_model(m_is_output_of_item.get('source_organization'),
                                                                  es_project, 'source_organization')

                es_dataset['project'].append(es_project)

            if m_rd.get('contributor', False):
                es_dataset['contributor'] = []
                self._convert_metax_org_or_person_to_es_model(m_rd.get('contributor'), es_dataset, 'contributor')

            if m_rd.get('publisher', False):
                es_dataset['publisher'] = []
                self._convert_metax_org_or_person_to_es_model(m_rd.get('publisher'), es_dataset, 'publisher')

            if m_rd.get('curator', False):
                es_dataset['curator'] = []
                self._convert_metax_org_or_person_to_es_model(m_rd.get('curator'), es_dataset, 'curator')

            if m_rd.get('creator', False):
                es_dataset['creator'] = []
                self._convert_metax_org_or_person_to_es_model(m_rd.get('creator'), es_dataset, 'creator')

            if m_rd.get('rights_holder', False):
                es_dataset['rights_holder'] = []
                self._convert_metax_org_or_person_to_es_model(m_rd.get('rights_holder'), es_dataset, 'rights_holder')

        return es_dataset

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
                output = self._get_converted_single_org_or_person_es_model(m_input)

        es_output[relation_name] = output

    def _get_converted_single_org_or_person_es_model(self, m_obj):
        if m_obj.get('@type', '') not in ['Person', 'Organization']:
            return None

        out_obj = self._get_es_person_or_org_common_data_from_metax_obj(m_obj)

        agent_type = m_obj.get('@type')
        if agent_type == 'Person' and m_obj.get('member_of', False):
            out_obj.update(
                {'belongs_to_org': self._get_es_person_or_org_common_data_from_metax_obj(m_obj.get('member_of'))})
        elif agent_type == 'Organization' and m_obj.get('is_part_of', False):
            out_obj.update(
                {'belongs_to_org': self._get_es_person_or_org_common_data_from_metax_obj(m_obj.get('is_part_of'))})

        return out_obj

    @staticmethod
    def _convert_metax_obj_containing_identifier_and_label_to_es_model(m_input, es_output, m_input_label_field,
                                                                       m_input_label_is_array=False,
                                                                       es_relation_name=''):
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
            es_output['identifier'] = m_input.get('identifier', ''),
            es_output['label'] = m_input.get(m_input_label_field, [] if m_input_label_is_array else {})

    @staticmethod
    def _get_es_person_or_org_common_data_from_metax_obj(m_obj):
        # If organization has several names, concat them all in one string
        if isinstance(m_obj.get('name'), dict):
            name = ''
            for lang, name_in_lang in m_obj.get('name').items():
                name += name_in_lang + ' '
        else:
            name = m_obj.get('name', '')

        return {
            'identifier': m_obj.get('identifier', ''),
            'name': name,
            'email': m_obj.get('email', ''),
            'telephone': m_obj.get('telephone', ''),
            'agent_type': m_obj.get('@type'),
            'homepage': m_obj.get('homepage', {})
        }
