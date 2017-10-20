"""
Consumer connects to Metax RabbitMQ and listens for changes in Metax.
When metadata is created, updated or deleted, consumer calls appropriate
functions to propagate the change to Etsin search index.

This script should be run as a standalone. It's not part of the Flask app.
(ssh to server or Vagrant)
sudo su - etsin-user
source pyenv
python /etsin/etsin_finder/rabbitmq_client.py

Press CTRL+C to exit script.
"""

import pika
import yaml

with open('/home/etsin-user/app_config') as app_config_file:
    settings = yaml.load(app_config_file)['METAX_RABBITMQ']

credentials = pika.PlainCredentials(settings['USER'], settings['PASSWORD'])
connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        settings['HOST'],
        settings['PORT'],
        settings['VHOST'],
        credentials))

channel = connection.channel()

exchange = settings['EXCHANGE']
queue_1 = 'etsin-create'
queue_2 = 'etsin-update'
queue_3 = 'etsin-delete'

channel.queue_declare(queue_1, durable=True)
channel.queue_declare(queue_2, durable=True)
channel.queue_declare(queue_3, durable=True)

channel.queue_bind(exchange=exchange, queue=queue_1, routing_key='create')
channel.queue_bind(exchange=exchange, queue=queue_2, routing_key='update')
channel.queue_bind(exchange=exchange, queue=queue_3, routing_key='delete')


def callback_1(ch, method, properties, body):
    print(" [ create ] %r" % body)
    channel.basic_ack(delivery_tag=method.delivery_tag)


def callback_2(ch, method, properties, body):
    print(" [ update ] %r" % body)
    channel.basic_ack(delivery_tag=method.delivery_tag)


def callback_3(ch, method, properties, body):
    print(" [ delete ] %r" % body)
    channel.basic_ack(delivery_tag=method.delivery_tag)


channel.basic_consume(callback_1, queue=queue_1)
channel.basic_consume(callback_2, queue=queue_2)
channel.basic_consume(callback_3, queue=queue_3)

print('[*] Waiting for logs. To exit press CTRL+C')
channel.start_consuming()
