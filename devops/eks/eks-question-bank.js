/* ============================================================================
   EKS Skill Track — Question Bank
   window.EKS_QUESTION_BANK[moduleKey][sectionId] = [ {q, options[], correctIndex, type}, ... ]

   Per-section "Check Your Understanding" MCQs (used inline in each module).
   The module reads questions via window.EKS_QUESTION_BANK['m1']['s1'] etc.

   Question "type" tags (used for analytics + to seed the randomized exam draw):
     'technical' — core EKS mechanics
     'scenario'  — applied / situational judgement
     'pillar'    — "which Well-Architected pillar does this address?"
     'wa-fix'    — "what is the Well-Architected-aligned fix?"

   NOTE: This file powers the per-section checks. The separate randomized
   skill-assessment (30–45 Qs drawn from an oversized pool) will read from the
   same window.EKS_QUESTION_BANK namespace plus an exam-only pool added later.
   ============================================================================ */
window.EKS_QUESTION_BANK = {
  m1: {
    /* ── Section 1: Control plane & the shared-responsibility split ── */
    s1: [
      {
        q: "In Amazon EKS, who is responsible for patching and scaling the Kubernetes control plane (API server and etcd)?",
        options: [
          "The customer, via kubectl and node maintenance windows",
          "AWS — the control plane is fully managed and runs in an AWS-owned account",
          "A shared cron job the customer schedules on the worker nodes",
          "Whichever IAM principal created the cluster"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team is choosing EKS specifically so they do not have to run and patch etcd themselves. Which Well-Architected pillar does offloading control-plane management to AWS most directly support?",
        options: [
          "Cost Optimization, because the control plane is free",
          "Operational Excellence, by reducing the operational burden of managing undifferentiated infrastructure",
          "Performance Efficiency, because AWS control planes are always faster",
          "Sustainability, because etcd uses less disk on AWS"
        ],
        correctIndex: 1,
        type: "pillar"
      },
      {
        q: "Your cluster's API server endpoint is publicly accessible (0.0.0.0/0) and you want to align with Well-Architected security guidance without breaking your CI runners that live in the same VPC. What is the recommended fix?",
        options: [
          "Delete the cluster and recreate it as private-only, forcing all access through a bastion",
          "Leave it public but rely on Kubernetes RBAC alone to restrict access",
          "Enable the private endpoint and restrict the public endpoint to known CIDR ranges (or disable it), keeping in-VPC access via the private endpoint",
          "Move the API server to a worker node so it sits inside the VPC"
        ],
        correctIndex: 2,
        type: "wa-fix"
      }
    ],

    /* ── Section 2: Provisioning the cluster (eksctl / Terraform) ── */
    s2: [
      {
        q: "What does eksctl create on your behalf that a raw `aws eks create-cluster` call does NOT, making it a faster path for a first cluster?",
        options: [
          "Nothing — they are identical commands with different names",
          "The supporting VPC, subnets, IAM roles, and (optionally) node groups, orchestrated as CloudFormation stacks",
          "A managed Prometheus workspace and Grafana dashboard",
          "A second control plane for high availability"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team provisions clusters by clicking through the AWS console and hand-running CLI commands, with no record of what was created. Which Well-Architected-aligned practice should they adopt?",
        options: [
          "Define the cluster and its dependencies as code (eksctl config or Terraform) committed to version control, so provisioning is repeatable and auditable",
          "Take a screenshot of the console after each change",
          "Email the CLI history to the team after provisioning",
          "Avoid changing the cluster once it is created"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Defining your EKS cluster in Terraform and committing it to version control most directly supports which pillar?",
        options: [
          "Reliability, through repeatable, version-controlled provisioning that can be recreated after a failure",
          "Cost Optimization, because Terraform is cheaper than eksctl",
          "Performance Efficiency, because Terraform-built clusters run faster",
          "Security, because Terraform encrypts the control plane"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 3: Cluster authentication & access (IAM ↔ Kubernetes) ── */
    s3: [
      {
        q: "When you first create an EKS cluster, which identity is automatically granted cluster-admin in Kubernetes RBAC?",
        options: [
          "The AWS account root user, always",
          "The IAM principal (user or role) that created the cluster",
          "Every IAM user in the account",
          "No one — you must bootstrap access manually with a kubeconfig file"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "EKS now offers 'access entries' as an alternative to editing the aws-auth ConfigMap. Why are access entries generally preferred for managing who can reach the cluster?",
        options: [
          "They let you skip IAM entirely and use passwords",
          "They are a first-class, API-driven, auditable way to map IAM principals to Kubernetes access, avoiding the fragile, hand-edited aws-auth ConfigMap",
          "They make the cluster control plane run faster",
          "They are required for Fargate to work"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A single shared IAM role is used by the whole team to get cluster-admin on every cluster. Which Well-Architected-aligned fix best addresses this?",
        options: [
          "Share the role's credentials in a team password manager so access is at least centralized",
          "Map distinct IAM principals to least-privilege Kubernetes RBAC roles via access entries, granting cluster-admin only where genuinely required",
          "Disable RBAC so access is simpler to reason about",
          "Give everyone the cluster-creator role to avoid confusion"
        ],
        correctIndex: 1,
        type: "wa-fix"
      },
      {
        q: "Scoping each engineer's cluster access to least privilege rather than blanket cluster-admin most directly supports which pillar?",
        options: [
          "Performance Efficiency",
          "Cost Optimization",
          "Security, by enforcing least-privilege access to a sensitive control plane",
          "Sustainability"
        ],
        correctIndex: 2,
        type: "pillar"
      }
    ],

    /* ── Section 4: Cluster versions, upgrades & the EKS lifecycle ── */
    s4: [
      {
        q: "When you upgrade an EKS cluster's Kubernetes version, what is the correct ordering of components?",
        options: [
          "Worker nodes first, then the control plane, then add-ons",
          "Control plane first, then add-ons (e.g. CoreDNS, kube-proxy, VPC CNI), then worker node groups — never letting nodes run more than one minor version behind the control plane",
          "Everything at once via a single command, in any order",
          "Add-ons first, then nodes, then the control plane last"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team is several Kubernetes minor versions behind and their EKS version is approaching end of standard support, where extended support incurs higher per-hour cluster cost. Which Well-Architected-aligned practice should they adopt?",
        options: [
          "Stay on the old version indefinitely; upgrades are risky",
          "Establish a regular, tested upgrade cadence (one minor version at a time, validated in a non-prod cluster first) to stay within standard support",
          "Delete and recreate the cluster on every new release",
          "Wait until AWS forcibly upgrades the cluster"
        ],
        correctIndex: 1,
        type: "wa-fix"
      },
      {
        q: "Letting an EKS cluster fall onto paid extended support by neglecting upgrades is, above all, a failure against which pillar?",
        options: [
          "Cost Optimization — extended support carries a higher cluster charge that a regular upgrade cadence would avoid",
          "Security only",
          "Performance Efficiency only",
          "There is no pillar implication; version is purely cosmetic"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ]
  },

  m2: {
    /* ── Section 1: Managed node groups vs. self-managed ── */
    s1: [
      {
        q: "What is the defining advantage of an EKS managed node group over a self-managed group of EC2 instances you wire up yourself?",
        options: [
          "Managed node groups run without any EC2 cost",
          "AWS handles provisioning, lifecycle, and graceful draining/cordoning of nodes during updates, while you still own the workloads on them",
          "Managed node groups remove the need for a VPC",
          "Self-managed groups cannot run Kubernetes at all"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team hand-rolls its worker nodes with custom scripts, and node OS patching has silently fallen months behind because the process is manual. Which Well-Architected-aligned fix best addresses this?",
        options: [
          "Move to managed node groups so AMI/patch updates are an AWS-driven, repeatable operation rather than a manual chore",
          "Stop patching nodes entirely to avoid the effort",
          "Run all workloads on a single very large node to reduce the patch surface",
          "Disable updates and recreate the cluster yearly"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Choosing managed node groups so that node lifecycle and patching become a repeatable, low-toil operation most directly supports which pillar?",
        options: [
          "Operational Excellence, by reducing manual operational effort and standardizing node lifecycle",
          "Cost Optimization, because managed nodes are always cheaper",
          "Performance Efficiency, because managed nodes are faster",
          "Sustainability, exclusively"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 2: Fargate — serverless pods ── */
    s2: [
      {
        q: "With EKS on Fargate, what changes about who manages the compute your pods run on?",
        options: [
          "Nothing — you still provision and patch EC2 nodes",
          "AWS provisions right-sized, isolated compute per pod on demand; there are no EC2 worker nodes for you to manage or patch",
          "Pods stop needing CPU or memory",
          "You must run a second control plane for Fargate"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A small, bursty internal service runs on a node group sized for peak, so most of the time the team pays for idle capacity. They want to stop paying for nodes that sit empty. Which option best fits?",
        options: [
          "Run the service on Fargate so compute is provisioned per pod and you pay for what the pods actually request, with no idle node capacity",
          "Buy a larger node to be safe",
          "Run two clusters for redundancy",
          "Disable autoscaling so capacity is predictable"
        ],
        correctIndex: 0,
        type: "scenario"
      },
      {
        q: "Eliminating idle, always-on node capacity by running bursty workloads on per-pod Fargate compute most directly supports which pillar?",
        options: [
          "Cost Optimization, by paying for compute the workload actually uses instead of idle nodes",
          "Reliability, exclusively",
          "Security, exclusively",
          "Performance Efficiency, because Fargate pods are always faster than EC2"
        ],
        correctIndex: 0,
        type: "pillar"
      },
      {
        q: "Which is a genuine constraint to weigh before choosing Fargate for a workload?",
        options: [
          "Fargate cannot run Linux containers",
          "Fargate does not support certain workloads — e.g. those needing DaemonSets, privileged pods, or specific host-level access — and per-pod pricing can cost more than packed EC2 for steady, dense workloads",
          "Fargate requires you to manage etcd",
          "Fargate only works without a VPC"
        ],
        correctIndex: 1,
        type: "technical"
      }
    ],

    /* ── Section 3: Scaling — Cluster Autoscaler / Karpenter & pod autoscaling ── */
    s3: [
      {
        q: "In a node-group-based cluster, what is the role of a node autoscaler such as the Cluster Autoscaler or Karpenter?",
        options: [
          "It scales the number of pods up and down",
          "It adds or removes worker nodes in response to pods that can't be scheduled (or nodes that are underused), so capacity tracks demand",
          "It patches the control plane",
          "It replaces the need for a Deployment"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "How does node autoscaling differ from the Horizontal Pod Autoscaler (HPA)?",
        options: [
          "They are two names for the same thing",
          "The HPA changes the number of pod replicas based on metrics like CPU; the node autoscaler changes the number of nodes so those pods have somewhere to run — they work together",
          "The HPA manages nodes and the node autoscaler manages pods",
          "Only one can be enabled per cluster"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A cluster runs a fixed, large node group around the clock to absorb occasional spikes, leaving most capacity idle off-peak. Which Well-Architected-aligned fix best matches capacity to demand?",
        options: [
          "Adopt node autoscaling (Cluster Autoscaler or Karpenter) plus an HPA so nodes and pods scale with actual load instead of being statically over-provisioned",
          "Manually resize the node group every morning and evening",
          "Always run at peak size to be safe",
          "Move the control plane to a bigger instance"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Letting capacity scale up under load and back down when idle, rather than statically provisioning for peak, primarily serves which two pillars?",
        options: [
          "Cost Optimization and Performance Efficiency — you pay for what you need while still meeting demand",
          "Security and Sustainability only",
          "Reliability and Security only",
          "There is no pillar relevance to autoscaling"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 4: Choosing a compute model ── */
    s4: [
      {
        q: "For a steady, dense, cost-sensitive batch workload running 24/7, which compute model is usually most economical?",
        options: [
          "Fargate, because per-pod pricing is always cheapest",
          "Well-packed EC2 managed node groups (optionally with Spot/savings plans), since steady dense load amortizes node cost better than per-pod Fargate pricing",
          "A single giant node with no autoscaling",
          "Running the workload on the control plane"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team wants to run a small, spiky workload with the least operational overhead and no nodes to patch, accepting a possible per-pod price premium. Which model fits best?",
        options: [
          "Self-managed EC2 with hand-rolled scripts",
          "Fargate — no nodes to manage or patch, compute provisioned per pod, ideal for small/bursty workloads where low ops overhead outweighs packing efficiency",
          "A fixed peak-sized node group",
          "Two clusters in active-active"
        ],
        correctIndex: 1,
        type: "scenario"
      },
      {
        q: "Deliberately matching each workload to the compute model that fits its load shape and ops profile — Fargate for bursty/low-toil, packed autoscaled EC2 for steady/dense — best reflects which pillar?",
        options: [
          "Cost Optimization, by selecting the most cost-effective compute for each workload's actual pattern",
          "Security, exclusively",
          "Reliability, exclusively",
          "There is no pillar relevance to compute choice"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ]
  },

  m3: {
    /* ── Section 1: The problem with static credentials in pods ── */
    s1: [
      {
        q: "Why is baking long-lived AWS access keys into a pod (as env vars or a mounted secret) considered an anti-pattern?",
        options: [
          "Pods cannot read environment variables",
          "Static long-lived keys are hard to rotate, easily leaked, and grant standing access that outlives any single task — a large, persistent attack surface",
          "AWS blocks all environment variables in EKS",
          "Keys make pods start more slowly"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A workload reaches S3 using an access key/secret pasted into a Kubernetes Secret, shared across several pods and never rotated. Which Well-Architected-aligned fix best addresses this?",
        options: [
          "Replace static keys with a mechanism that gives each workload short-lived, automatically-rotated credentials scoped to just what it needs (IRSA or EKS Pod Identity)",
          "Move the key into an environment variable instead of a Secret",
          "Share one more powerful key so fewer keys exist overall",
          "Rotate the key once a year by hand"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Eliminating long-lived static credentials in favor of short-lived, per-workload identity most directly serves which pillar?",
        options: [
          "Security, by reducing credential exposure and enforcing least-privilege, short-lived access",
          "Cost Optimization, because identity is billed per key",
          "Performance Efficiency, because temporary credentials are faster",
          "Reliability, exclusively"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 2: IRSA — IAM Roles for Service Accounts ── */
    s2: [
      {
        q: "What does IRSA (IAM Roles for Service Accounts) actually associate?",
        options: [
          "An EC2 instance profile with the whole node",
          "A Kubernetes service account with an IAM role, so pods using that service account assume the role and receive short-lived, scoped AWS credentials",
          "A Kubernetes namespace with a VPC",
          "A pod with the cluster's root credentials"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "IRSA relies on an OIDC identity provider associated with the cluster. What role does that OIDC provider play?",
        options: [
          "It stores the pod's container images",
          "It lets AWS IAM trust the cluster's service account tokens, so a pod's projected token can be exchanged for IAM role credentials",
          "It replaces the need for IAM entirely",
          "It schedules pods onto nodes"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "Granting each workload its own IAM role via IRSA — rather than relying on the node's IAM role shared by every pod on that node — primarily improves what?",
        options: [
          "Pod startup speed",
          "Least privilege: each workload gets only the permissions it needs, instead of inheriting the node role's broad permissions shared by all pods on the node",
          "Cluster networking throughput",
          "The number of nodes you can run"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A cluster gives every pod access to whatever the node's IAM role can do, so a single compromised pod can reach everything that role allows. Which Well-Architected-aligned fix applies?",
        options: [
          "Use IRSA (or Pod Identity) to give each workload a narrowly-scoped role, so a compromised pod is limited to that workload's permissions, not the node's",
          "Give the node role even more permissions to simplify access",
          "Disable IAM on the nodes",
          "Run every pod as a DaemonSet"
        ],
        correctIndex: 0,
        type: "wa-fix"
      }
    ],

    /* ── Section 3: EKS Pod Identity ── */
    s3: [
      {
        q: "What does EKS Pod Identity simplify compared to IRSA?",
        options: [
          "It removes the need to run any pods",
          "It associates IAM roles with Kubernetes service accounts through an EKS-managed mechanism without requiring you to configure an OIDC provider and role trust policy per cluster",
          "It makes IAM roles unnecessary",
          "It only works on Fargate"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "An org runs many clusters and finds the per-cluster OIDC-provider and trust-policy setup for IRSA repetitive and error-prone to manage at scale. Which approach best reduces that operational overhead?",
        options: [
          "EKS Pod Identity, which uses a cluster add-on and reusable role associations, avoiding per-cluster OIDC trust-policy wiring",
          "Go back to static keys for simplicity",
          "Use the node role everywhere",
          "Run one giant cluster instead"
        ],
        correctIndex: 0,
        type: "scenario"
      },
      {
        q: "Choosing EKS Pod Identity to make per-workload IAM associations reusable and less error-prone across many clusters most directly serves which pillar?",
        options: [
          "Operational Excellence, by reducing repetitive, error-prone identity configuration at scale",
          "Cost Optimization, exclusively",
          "Performance Efficiency, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 4: Designing least-privilege workload access ── */
    s4: [
      {
        q: "When designing an IAM role for a specific workload (via IRSA or Pod Identity), what is the least-privilege approach?",
        options: [
          "Attach AdministratorAccess so it never lacks a permission",
          "Grant only the specific actions on the specific resources the workload needs (e.g. read one S3 bucket), and nothing more",
          "Reuse the cluster-creator's permissions",
          "Give it the node role plus extra permissions"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A workload only needs to read objects from one S3 bucket, but its role is granted s3:* on all buckets because that was quickest. Which Well-Architected-aligned fix applies?",
        options: [
          "Scope the role to s3:GetObject on that one bucket's ARN, removing the broad s3:* and all-bucket access",
          "Leave it — broad access is more convenient",
          "Add more services to the role to be safe",
          "Switch the workload to the node role"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Carefully scoping each workload's IAM role to the minimum actions and resources it needs best reflects which pillar?",
        options: [
          "Security, through least-privilege access that limits blast radius if a workload is compromised",
          "Cost Optimization, exclusively",
          "Reliability, exclusively",
          "Performance Efficiency, exclusively"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ]
  },

  m4: {
    /* ── Section 1: The VPC CNI — pods as first-class VPC citizens ── */
    s1: [
      {
        q: "What does the Amazon VPC CNI plugin do for pods in an EKS cluster?",
        options: [
          "It blocks all pod networking by default",
          "It assigns each pod an IP address from the cluster's VPC subnets, so pods are routable as first-class citizens on the VPC network",
          "It runs the control plane",
          "It replaces the need for security groups"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "Because the VPC CNI gives pods real VPC IPs, what practical constraint must you plan for?",
        options: [
          "Pods cannot use TCP",
          "Subnet IP exhaustion — each pod consumes a VPC IP, so subnets must be sized (or prefix delegation used) to accommodate pod density",
          "Pods can only talk to the internet, never each other",
          "Every pod needs its own VPC"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team deployed a cluster into small /27 subnets and hit pod scheduling failures because IPs ran out as pod count grew. Which Well-Architected-aligned fix best addresses this?",
        options: [
          "Plan VPC/subnet CIDR sizing (and consider VPC CNI prefix delegation) up front to provide enough IP space for expected pod density",
          "Stop scheduling pods past the limit",
          "Give every pod the same IP",
          "Disable the VPC CNI"
        ],
        correctIndex: 0,
        type: "wa-fix"
      }
    ],

    /* ── Section 2: Pod-to-pod & network policy ── */
    s2: [
      {
        q: "By default, can pods in different namespaces of an EKS cluster reach each other over the network?",
        options: [
          "No — namespaces are fully network-isolated by default",
          "Yes — by default Kubernetes networking is flat and allows pod-to-pod traffic across namespaces unless you add network policy to restrict it",
          "Only if they share a node",
          "Only the control plane can route between them"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A security review flags that any pod can talk to any other pod, including the payments service, with no restriction. Which Well-Architected-aligned fix applies?",
        options: [
          "Apply Kubernetes NetworkPolicies (enforced by the VPC CNI's network policy support or a CNI like Calico) to allow only required pod-to-pod traffic, denying the rest",
          "Delete the payments service",
          "Put every pod in one namespace",
          "Rely on pods being on different nodes"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Restricting pod-to-pod traffic to only what each workload legitimately needs, instead of leaving the network flat and open, most directly serves which pillar?",
        options: [
          "Security, by segmenting the network and limiting lateral movement",
          "Cost Optimization, exclusively",
          "Performance Efficiency, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      },
      {
        q: "EKS also lets you attach EC2 security groups to specific pods (security groups for pods). What does this enable?",
        options: [
          "Removing the need for any IAM",
          "Applying VPC-level security group rules directly to designated pods, so pod traffic is governed by the same security groups used elsewhere in the VPC",
          "Running pods without IP addresses",
          "Disabling network policy"
        ],
        correctIndex: 1,
        type: "technical"
      }
    ],

    /* ── Section 3: Exposing services — the AWS Load Balancer Controller ── */
    s3: [
      {
        q: "What does the AWS Load Balancer Controller do in an EKS cluster?",
        options: [
          "It runs your application containers",
          "It provisions and manages AWS Elastic Load Balancers (ALB for Ingress, NLB for Service type LoadBalancer) in response to Kubernetes Ingress/Service resources",
          "It assigns pod IP addresses",
          "It patches worker nodes"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "When you create a Kubernetes Ingress with the AWS Load Balancer Controller installed, what typically gets provisioned?",
        options: [
          "Nothing — Ingress is ignored on AWS",
          "An Application Load Balancer (ALB) that routes external HTTP/HTTPS traffic to your services based on the Ingress rules",
          "A new EKS cluster",
          "A static key for the pod"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team exposes services by manually creating and wiring up load balancers in the console, and the config drifts from what's in the cluster. Which Well-Architected-aligned fix applies?",
        options: [
          "Use the AWS Load Balancer Controller so load balancers are declaratively driven by Kubernetes Ingress/Service manifests, keeping infra in sync with the cluster",
          "Keep creating load balancers by hand but more carefully",
          "Expose every pod with a public IP",
          "Stop using load balancers"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Letting load balancers be declaratively managed from Kubernetes manifests rather than hand-wired in the console most directly serves which pillar?",
        options: [
          "Operational Excellence, by keeping load balancer configuration in sync with the cluster and version-controllable",
          "Security, exclusively",
          "Cost Optimization, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 4: Secure ingress — TLS, scheme, and exposure ── */
    s4: [
      {
        q: "For an internet-facing service, what is the recommended way to handle TLS termination with an ALB provisioned by the AWS Load Balancer Controller?",
        options: [
          "Disable TLS to simplify setup",
          "Terminate TLS at the ALB using an ACM certificate, so HTTPS is handled at the load balancer with managed certificates",
          "Hard-code a self-signed cert into every pod",
          "Use plain HTTP and rely on the VPC"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "An internal-only admin service was exposed with an internet-facing load balancer because that was the default. Which Well-Architected-aligned fix applies?",
        options: [
          "Provision it as an internal (scheme: internal) load balancer so it's reachable only within the VPC/network, not the public internet",
          "Leave it public but hope nobody finds it",
          "Put a comment in the manifest saying it's internal",
          "Expose it on every node's public IP"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Exposing only what must be public (internet-facing) and keeping internal services on internal load balancers, with TLS terminated at the ALB, most directly serves which pillar?",
        options: [
          "Security, by minimizing public exposure and encrypting traffic in transit",
          "Cost Optimization, exclusively",
          "Performance Efficiency, exclusively",
          "Reliability, exclusively"
        ],
        correctIndex: 0,
        type: "pillar"
      },
      {
        q: "A latency-sensitive, high-throughput TCP workload (not HTTP) needs external exposure. Which AWS load balancer type is the natural fit via the controller?",
        options: [
          "An Application Load Balancer (ALB), since it's always best",
          "A Network Load Balancer (NLB), which operates at layer 4 and suits high-throughput, low-latency TCP/UDP traffic",
          "No load balancer is possible for TCP",
          "A classic load balancer only"
        ],
        correctIndex: 1,
        type: "scenario"
      }
    ]
  },

  m5: {
    /* ── Section 1: Add-ons — managing core cluster components ── */
    s1: [
      {
        q: "What are EKS managed add-ons (e.g. CoreDNS, kube-proxy, VPC CNI, EBS CSI driver)?",
        options: [
          "Optional third-party apps unrelated to the cluster",
          "Core operational components of the cluster that EKS can install, version, and update for you through a managed mechanism rather than you maintaining them by hand",
          "Billing plans for the control plane",
          "A type of worker node"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team installs CoreDNS and the VPC CNI from raw manifests and updates them manually, and the versions have drifted out of step with the cluster's Kubernetes version. Which Well-Architected-aligned fix applies?",
        options: [
          "Adopt EKS managed add-ons so these core components are version-managed and updated through a consistent, repeatable mechanism aligned with the cluster version",
          "Stop using CoreDNS",
          "Pin every add-on to its oldest version forever",
          "Delete and recreate the cluster on each update"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Managing core components via EKS add-ons rather than hand-maintained manifests most directly serves which pillar?",
        options: [
          "Operational Excellence, by making core-component installation and updates consistent and repeatable",
          "Cost Optimization, exclusively",
          "Performance Efficiency, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 2: Observability — logs, metrics, and control-plane logging ── */
    s2: [
      {
        q: "Why is enabling EKS control plane logging (API server, audit, authenticator logs to CloudWatch) valuable?",
        options: [
          "It speeds up the control plane",
          "It gives you visibility into control-plane activity — API calls, authentication, and audit events — which is essential for troubleshooting and security investigation",
          "It is required for pods to start",
          "It replaces the need for worker nodes"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A cluster runs with no metrics or log aggregation, so when something breaks the team is debugging blind. Which Well-Architected-aligned fix applies?",
        options: [
          "Establish observability — metrics (e.g. Prometheus/CloudWatch), aggregated logs, and enabled control-plane logging — so issues can be detected and diagnosed",
          "Restart the cluster whenever something breaks",
          "Rely on users to report problems",
          "Turn off logging to reduce noise"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Instrumenting a cluster with metrics, aggregated logs, and control-plane logging before incidents occur most directly serves which pillar?",
        options: [
          "Operational Excellence, by enabling you to observe, detect, and diagnose issues",
          "Cost Optimization, exclusively",
          "Security, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      },
      {
        q: "Which integrates naturally with EKS for cluster and workload metrics, complementing your existing monitoring stack?",
        options: [
          "Only proprietary tools work with EKS",
          "Prometheus for metrics collection (often with Grafana for dashboards), and/or CloudWatch Container Insights — both common, well-supported choices on EKS",
          "Metrics are not possible on EKS",
          "Only the control plane can be monitored, never workloads"
        ],
        correctIndex: 1,
        type: "technical"
      }
    ],

    /* ── Section 3: Upgrades in practice ── */
    s3: [
      {
        q: "Module 1 covered upgrade ordering (control plane → add-ons → nodes). In practice, what most reduces upgrade risk?",
        options: [
          "Upgrading production first to find issues fastest",
          "Validating the upgrade in a non-production cluster first, checking for deprecated APIs, and ensuring pod disruption budgets are set so node rolls don't break availability",
          "Skipping multiple versions at once to save time",
          "Disabling workloads during the upgrade"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "Before upgrading, why check for deprecated/removed Kubernetes APIs?",
        options: [
          "Deprecated APIs make the cluster cheaper",
          "A new Kubernetes version may remove APIs your manifests still use, breaking workloads on upgrade; finding and updating them beforehand prevents outages",
          "APIs never change between versions",
          "It is only relevant to the control plane, not workloads"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A team wants node-group upgrades to roll without dropping below safe replica counts for their services. Which Well-Architected-aligned practice applies?",
        options: [
          "Define Pod Disruption Budgets so the node-drain process keeps enough replicas running during the roll, preserving availability",
          "Upgrade all nodes simultaneously",
          "Remove all replicas before upgrading",
          "Skip draining and force-delete pods"
        ],
        correctIndex: 0,
        type: "wa-fix"
      },
      {
        q: "Validating upgrades in non-prod and using disruption budgets so rolls don't dent availability most directly serves which pillar?",
        options: [
          "Reliability, by protecting workload availability through a tested, controlled upgrade",
          "Cost Optimization, exclusively",
          "Performance Efficiency, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ],

    /* ── Section 4: Troubleshooting a running cluster ── */
    s4: [
      {
        q: "A pod is stuck in Pending. What is the most useful first diagnostic step?",
        options: [
          "Delete the cluster",
          "Run kubectl describe pod to read its events — they usually state the reason (insufficient resources, no matching node, unschedulable, image issues)",
          "Restart every node",
          "Assume it is a control-plane outage"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "Pods are in CrashLoopBackOff. Which approach best isolates the cause?",
        options: [
          "Increase the number of replicas until some stay up",
          "Inspect the container logs (kubectl logs, including --previous) and the pod's events/describe to find why the container exits, then fix the root cause",
          "Delete the deployment and hope it resolves",
          "Add more nodes"
        ],
        correctIndex: 1,
        type: "technical"
      },
      {
        q: "A workload that recently worked now can't reach AWS APIs after an identity change. Drawing on earlier modules, what's a sound first hypothesis?",
        options: [
          "The control plane is down",
          "Its IAM/role association (IRSA or Pod Identity) or a tightened least-privilege policy may be misconfigured or over-restrictive — check the assumed role and its permissions",
          "Kubernetes itself removed AWS support",
          "The cluster ran out of nodes"
        ],
        correctIndex: 1,
        type: "scenario"
      },
      {
        q: "Maintaining a methodical troubleshooting approach — events, logs, describe, recent changes — rather than guessing, most reflects which pillar?",
        options: [
          "Operational Excellence, through systematic diagnosis and learning from operational events",
          "Cost Optimization, exclusively",
          "Security, exclusively",
          "There is no pillar relevance"
        ],
        correctIndex: 0,
        type: "pillar"
      }
    ]
  }
};
