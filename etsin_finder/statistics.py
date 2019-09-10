# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for performing operations related to Metax"""

import requests

from etsin_finder.finder import app
from etsin_finder.app_config import get_metax_api_config
from etsin_finder.utils import json_or_empty, FlaskService

log = app.logger


class MetaxAPIService(FlaskService):
    """Metax API Service"""

    def __init__(self, app):
        """
        Init Metax API Service.

        :param metax_api_config:
        """
        super().__init__(app)

        metax_api_config = get_metax_api_config(app.testing)

        if metax_api_config:
            METAX_GET_STATISTICS_URL = 'https://{0}/rpc/statistics/'.format(metax_api_config['HOST']) 
            
            self.METAX_GET_COUNT_DATASET_STATISTICS_URL = METAX_GET_STATISTICS_URL +'count_datasets?from_date={0}&to_date={1}'
            self.METAX_GET_ALL_DATASET_STATISTICS_URL = METAX_GET_STATISTICS_URL + 'all_datasets_cumulative?from_date={0}&to_date={1}'
            self.METAX_GET_ORGANIZATION_STATISTICS_URL = METAX_GET_STATISTICS_URL + 'organization_datasets_cumulative?from_date={0}&to_date={1}'


            self.user = metax_api_config['USER']
            self.pw = metax_api_config['PASSWORD']
            self.verify_ssl = metax_api_config.get('VERIFY_SSL', True)
        elif not self.is_testing:
            log.error("Unable to initialize MetaxAPIService due to missing config")

    def get_count_datasets(self, from_date, to_date):
        """
        Get cumulative statistics for a given time period

        :param to_date
        :param from_date
        :return:
        """
        count_datasets_url = self.METAX_GET_COUNT_DATASET_STATISTICS_URL.format(from_date, to_date)

        metax_api_response = requests.get(count_datasets_url,
                                        headers={'Accept': 'application/json'},
                                        auth=(self.user, self.pw),
                                        verify=self.verify_ssl,
                                        timeout=10)

        return "Count is: ---"

    def get_all_datasets(self, from_date, to_date):
        """
        Get statistics for all datasets for a given time period

        :param to_date:
        :param from_date:
        :return:
        """

        all_datasets_cumulative_url = self.METAX_GET_ALL_DATASET_STATISTICS_URL.format(from_date, to_date)
        
        metax_api_response = requests.get(all_datasets_cumulative_url,
                                            headers={'Accept': 'application/json'},
                                            auth=(self.user, self.pw),
                                            verify=self.verify_ssl,
                                            timeout=10)
        
        print(metax_api_response.json()[i]["month"])

        totalsum = [metax_api_response.json()[month]['count'] ]

        for i in range(0, months):

            count = metax_api_response.json()[i]['count']
            count_cumulative = metax_api_response.json()[i]['count_cumulative']

        return "Count from_date to to_date is: ---"


    def get_datasets_by_organization(self, from_date, to_date):
        """
        Get statistics for datasets by organization 

        :param to_date:
        :param from_date:
        :return:
        """
        
        organization_data_url = self.METAX_GET_ORGANIZATION_STATISTICS_URL.format(from_date, to_date)

        
        metax_api_response = requests.get(organization_data_url,
                                    headers={'Accept': 'application/json'},
                                    auth=(self.user, self.pw),
                                    verify=self.verify_ssl,
                                    timeout=10)

        organizations = [name for name in metax_api_response.json().keys()]

        identifiers = {name : metax_api_response.json()[name] for name in organizations}

        sum_by_organization = {name : identifiers[name]['total']['count'] for name in organizations}
        csum_by_organization = {name : identifiers[name]['total']['count_cumulative'] for name in organizations}

        sum_all_organizations = sum(sum_by_organization.values())
        csum_all_organizations = sum(csum_by_organization.values())

        return [sum_by_organization, csum_by_organization, sum_all_organizations, csum_all_organizations]


_metax_api = MetaxAPIService(app)



