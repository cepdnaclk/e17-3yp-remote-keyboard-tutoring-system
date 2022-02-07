# AWS
<img src="./images/aws_logo.png" width=100%>

AWS needs no formal introduction, given its immense popularity. The leading cloud provider in the marketplace is Amazon Web Services. It provides over 170 AWS services to the developers so they can access them from anywhere at the time of need. We'll be using the follwoing services they provide.

## AWS EC2

An Amazon EC2 instance is a virtual server in Amazon's Elastic Compute Cloud (EC2) for running applications on the Amazon Web Services (AWS) infrastructure. EC2 is a service that enables subscribers to run application programs in the computing environment. It can serve as a practically unlimited set of virtual machines. We'll be using it to host our web sites, API endpoints and data base.

## AWS Backup

AWS backup is a service introduced in 2019 for Backing up data for services running in the AWS cloud. Before this, subscribers used  EBS snapshots to backup local storage for an EC2 instance, or AWS Storage Gateway to backup data from local storage devices to Amazon S3. But with AWS Backup services Amazon lets you automate and centrally manage backups across the enterprise.

# Flat API (2.13.0)

<img src="./images/logo-flat.svg" width=100%>

Our product will often use MIDI messages to transmit data between the keyboard visualizer bar and the processing unit. But MIDI itself isn't interactive with most of the beginners. They'll be needing score sheets or sheet music to recognize what to play or, what is being played in his/her keyboard synthesizer. Therefor we'll be introducing a feature in a our web and mobile apps to convert these midi files to sheet music.

We'll be using Flat API as a third party API to provide this service to our clients.