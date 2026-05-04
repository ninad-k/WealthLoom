terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Recommended: Store state in S3 instead of locally
  # backend "s3" {
  #   bucket = "luminacast-terraform-state"
  #   key    = "prod/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "LuminaCast"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
