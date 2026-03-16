terraform {
  backend "s3" {
    use_lockfile = true
  }
  required_version = ">= 1.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>6.8.0"
    }
  }
}

provider "aws" {
  region = var.region
}
