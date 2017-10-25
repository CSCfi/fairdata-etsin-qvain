'''
Consumer connects to Metax RabbitMQ and listens for changes in Metax.
When metadata is created, updated or deleted, consumer calls appropriate 
functions to propagate the change to Etsin search index.

This script should be run as a standalone. It's not part of the Flask app.
(ssh to server or Vagrant)
sudo su - etsin-user
source_pyenv
python /etsin/etsin_finder/rabbitmq_client.py

Press CTRL+C to exit script.
'''

import json
import logging
import pika
import yaml

import sys
sys.path.append('/etsin/etsin_finder')
from etsin_finder.catalog_record_converter import CRConverter
from etsin_finder.elasticsearch.elasticsearch_service import ElasticSearchService

# Get configs
with open('/home/etsin-user/app_config') as app_config_file:
    settings = yaml.load(app_config_file)
    rabbit_settings = settings['METAX_RABBITMQ']
    es_settings = settings['ELASTICSEARCH']
    if not rabbit_settings or not es_settings:
        quit()

# Set up RabbitMQ connection, channel, exchange and queues
credentials = pika.PlainCredentials(
    rabbit_settings['USER'], rabbit_settings['PASSWORD'])
# connection = pika.BlockingConnection(
#     pika.ConnectionParameters(
#         rabbit_settings['HOST'],
#         rabbit_settings['PORT'],
#         rabbit_settings['VHOST'],
#         credentials))

# channel = connection.channel()

exchange = rabbit_settings['EXCHANGE']
queue_1 = 'etsin-create'
queue_2 = 'etsin-update'
queue_3 = 'etsin-delete'

# channel.queue_declare(queue_1, durable=True)
# channel.queue_declare(queue_2, durable=True)
# channel.queue_declare(queue_3, durable=True)

# channel.queue_bind(exchange=exchange, queue=queue_1, routing_key='create')
# channel.queue_bind(exchange=exchange, queue=queue_2, routing_key='update')
# channel.queue_bind(exchange=exchange, queue=queue_3, routing_key='delete')

# Set up ElasticSearch client
es_client = ElasticSearchService(es_settings)
if not es_client:
    quit()
if not es_client.index_exists():
    if not es_client.create_index_and_mapping():
        quit()

# Set up logging
logging.basicConfig(filename='/var/log/etsin_finder/rabbitmq.log', level='INFO', 
  format="[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")

def callback_reindex(ch, method, properties, body):
    logging.info("{0}{1} into index {2}".format(
        "Trying to reindex data with doc id {0} having type ".format(dataset_data_model.get_es_document_id()),
        self.INDEX_DOC_TYPE_NAME, self.INDEX_NAME))
    converter = CRConverter()
    es_data_model = converter.convert_metax_catalog_record_json_to_es_data_model(
        json.loads(body))
    es_client.reindex_dataset(es_data_model)
    channel.basic_ack(delivery_tag=method.delivery_tag)


def callback_delete(ch, method, properties, body):
    es_client.delete(index=self.INDEX_NAME,
                     doc_type=self.INDEX_DOC_TYPE_NAME, id=body)
    channel.basic_ack(delivery_tag=method.delivery_tag)


# Set up consumer
# channel.basic_consume(callback_reindex, queue=queue_1)
# channel.basic_consume(callback_reindex, queue=queue_2)
# channel.basic_consume(callback_delete, queue=queue_3)

logging.info('[*] Waiting for logs. To exit press CTRL+C')
print('[*] Waiting for logs. To exit press CTRL+C')
# channel.start_consuming()
