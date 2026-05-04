# Private S3 Bucket for Video Storage
resource "aws_s3_bucket" "video_vault" {
  bucket = "luminacast-video-vault-${var.environment}"

  tags = {
    Name = "LuminaCast Video Vault"
  }
}

# Ensure Public Access is Blocked (Anti-Piracy)
resource "aws_s3_bucket_public_access_block" "video_vault_access" {
  bucket = aws_s3_bucket.video_vault.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CORS Configuration to allow Next.js to upload via Presigned PUT
resource "aws_s3_bucket_cors_configuration" "video_vault_cors" {
  bucket = aws_s3_bucket.video_vault.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"] # In production, restrict this to your exact domain
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
