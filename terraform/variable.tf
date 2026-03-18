variable "lambda_runtime" {
  description = "Lambda runtime for all Node.js functions"
  type        = string
  default     = "nodejs24.x"
}

variable "region" {
  description = "AWS region to deploy resources in"
  type        = string
}

variable "environment" {
  description = "Deployment environment (e.g. dev, pre-prod, prod)"
  type        = string
}
