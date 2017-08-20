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
 <br>docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Sun 2017-08-20 12:08:38 GMT; 9h ago
     Docs: http://docs.docker.com

### 2.2 Install Kubernetes
In this step we will configure Master Node and Worker nodes.

#### 		Configure Master Node

 ###### Configure kubectl ( needed only for master)  - 
 
 [Refer Install Kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)
      Run below command on k8_master node 
      	curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
	
	After above Run 
	
		Run below command
			[root@k8-master opc]# chmod +x ./kubectl
			[root@k8-master opc]# sudo mv ./kubectl /usr/local/bin/kubectl

###### Install Kubelet and Kubeadm
1. Create repos file for kubeadm and kubelet

	cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF

2. Run below command 

setenforce 0
yum install -y kubelet kubeadm
systemctl enable kubelet && systemctl start kubelet

###### Configure Kubernetes Master

1. Run below command to initialize kubeadm . kubeadm will provision kubernetes cluster. 
	kubeadm init --pod-network-cidr=10.244.0.0/16
	
	pod-network-cidr parameter need to be passed if using flannel for Container Networking. 
	
2. Wait for kubeadm init command to finish. ( may take around 5-10 mins) 

3. Look at the output of kubeadm and save it in notepad. From that output run the below comands on Master Host as regular user.

	To start using your cluster, you need to run (as a regular user):

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

4. Run below commands for flannel network
	kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
	kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel-rbac.yml
	
5. Verify whether Master is configured correctly

	[opc@k8-master ~]$ kubectl get pods --all-namespaces
	It should print something like below
	
	NAMESPACE     NAME                                READY     STATUS    RESTARTS   AGE
	kube-system   etcd-k8-master                      1/1       Running   0          4m
	kube-system   kube-apiserver-k8-master            1/1       Running   0          4m
	kube-system   kube-controller-manager-k8-master   1/1       Running   0          4m
	kube-system   kube-dns-2425271678-vwwpt           3/3       Running   0          4m
	kube-system   kube-flannel-ds-5n1fr               2/2       Running   2          48s
	kube-system   kube-proxy-j0xbp                    1/1       Running   0          4m
	kube-system   kube-scheduler-k8-master            1/1       Running   0          3m

This completes the configuration of Master Node.

#### 		Configure Worker Nodes

## 2.3 Verify Kubernetes Installation

## Step 3 Deploy Sample Application

## Step 4 Configure Load Balancer

## Conclusion
