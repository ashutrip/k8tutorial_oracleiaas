# Setting up Kubernetes Cluster on Oracle Bare Metal Cloud Service in Less than 30 minutes
Step by step guide to set up Kubernetes Cluster on Oracle Bare Metal Cloud Services. All the steps can be automated however following step by step approach would provide better insights into how things are done

## Introduction
Introduction
This tutorial shows you how to build and deploy a Kubernetes Cluster on Oracle Bare Metal Cloud Services. Oracle Metal Cloud enables organizations to run Enterprise Workloads on highly available infrastructure that provides best price performance in market.

Kubernetes is an Open Source System for automating deployment, scaling and management of Containerize applications. Follow the rest of the guide to bring up K8 ( Kubernetes) Cluster in Oracle Bare Metal Environment. 

Prerequisite: Oracle Bare Metal Access [Request for Trial account](https://cloud.oracle.com/en_US/tryit)

## High Level Architecture
![alt text](https://github.com/ashutrip/k8tutorial_oracleiaas/blob/master/HighLevelArchitecture.png "High Level Architecture")

 Key Points
 ----------
  - All Nodes ( One Master Node & 3 Worker Nodes are running Core OS 7 version 
  - All worker nodes are spread across 3 Availability Domain in Phoenix region
  - Load Balancer is used to distribute user traffic across all worker nodes
  
## Step 1 Configure Hosts on Oracle Cloud Environment

This step we will configure 4 hosts. Hosts can be configured as Virtual Hosts or Bare Metal host. This demonstration is using 2 OCPU shape for nodes. Master node is running only on one instance and worker nodes are running on 3 different virtual machines spread across different availability domain to provide high availability. 

1. Follow steps mentioned [Launch your first Instance] https://docs.us-phoenix-1.oraclecloud.com/Content/GSG/Reference/overviewworkflow.htm
2. Configure Block Storage for each individual hosts
3. By now should have 4 Host machines (K8_MASTER, K8_WRK_1_AD1, K8_WRK_2_AD2, and K8_WRK_3_AD3) up and running? 
3. User Private Key created in step 1 to log into each virtual hosts and run below commands.
	- Run <b>sudo yum update –y</b> on all machines
	- Disable and stop firewall service. This is to enable intercommunication between master node and worker nodes. 
		sudo systemctl disable firewalld && systemctl stop firewalld
4. Go to Virtual Cloud Network Security list and open below to open ports  for VCN CIDR block
	-Source CIDR 10.0.0.0/16 ( or whatever VCN CIDR used in your environment)
	-Destination Port 6443 and 2379 used for Master Node Communication ( port 6443 and 2379 are default ports in K8) 

## Step 2 Configure Kubernetes on Host
All Kubernetes Host should have docker running and Kubernetes configured. Follow the steps to configure Dokcer and Kubernetes on each host.

### 2.1 Install Docker
Docker set up is needed on all machines. Repeat below commands for all hosts ( 1 Master and 3 worker nodes)

[root@k8-master opc]# yum install docker –y
[root@k8-master opc]# systemctl enable docker && systemctl start docker

Run below commands as well so that docker commands can be accessed as non root users as well
$ sudo groupadd docker
$ sudo usermod -aG docker $USER  ( in my case its opc) 

Docker should be up and running by now.  Verify with below commands

<b>[opc@k8-wrk-1-ad1 ~]$ sudo systemctl status docker</b>
 docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Sun 2017-08-20 12:08:38 GMT; 9h ago
     Docs: http://docs.docker.com

### 2.2 Install Kubernetes

#### 		Configure Master Node

#### 		Configure Worker Nodes

## 2.3 Verify Kubernetes Installation

## Step 3 Deploy Sample Application

## Step 4 Configure Load Balancer

## Conclusion
