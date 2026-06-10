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
  }
};
