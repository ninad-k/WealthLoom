# RDS Security Group
resource "aws_security_group" "rds" {
  name        = "luminacast-rds-sg"
  description = "Allow inbound traffic from ECS tasks"
  vpc_id      = aws_vpc.main.id

  ingress {
    protocol        = "tcp"
    from_port       = 5432
    to_port         = 5432
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "luminacast-db-subnet-group"
  subnet_ids = [aws_subnet.private_1.id, aws_subnet.private_2.id]

  tags = {
    Name = "LuminaCast DB subnet group"
  }
}

# PostgreSQL Database Instance
resource "aws_db_instance" "main" {
  identifier           = "luminacast-prod-db"
  allocated_storage    = 20
  storage_type         = "gp3"
  engine               = "postgres"
  engine_version       = "16"
  instance_class       = "db.t4g.micro" # Cost-effective production tier
  db_name              = "luminacast"
  username             = "luminacastadmin"
  password             = var.db_password
  db_subnet_group_name = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  skip_final_snapshot    = true # Set to false in real production
  publicly_accessible    = false # ISO 27001 Security Standard

  tags = {
    Name = "luminacast-postgres"
  }
}
