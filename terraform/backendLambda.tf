# Create the Lambda function
resource "aws_lambda_function" "backend_lambda" {
  function_name    = "${local.resource_prefix}-backend-lambda"
  description      = "Lambda function for the defect detection service as part of the dev test"
  role             = aws_iam_role.backend_lambda_role.arn
  handler          = "lib/backend/src/index.handler"
  runtime          = var.lambda_runtime
  memory_size      = 1024
  timeout          = 900
  filename         = "../lambda-deploy.zip"
  source_code_hash = filebase64sha256("../lambda-deploy.zip")

  environment {
    variables = {
      DEFECT_DETECTION_API_URL = var.defect_detection_api_url
    }
  }
}

resource "aws_iam_role" "backend_lambda_role" {
  name = "${local.resource_prefix}-backend-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.backend_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.dev_test_api_gateway.execution_arn}/*/*"
}



