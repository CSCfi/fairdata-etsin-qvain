import sys
from domain.organization_data import OrganizationData
from domain.reference_data import ReferenceData
from service.elasticsearch_service import ElasticSearchService

def main():

    es = ElasticSearchService(['http://localhost:9200'])



    print("Done")
    sys.exit(0)


if __name__ == '__main__':
    # calling main function
    main()
