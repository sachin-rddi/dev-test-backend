resource "aws_api_gateway_rest_api" "dev_test_api_gateway" {
  name        = "${local.resource_prefix}-api-gateway"
  description = "API Gateway for the defect detection service as part of the dev test"
}

resource "aws_api_gateway_resource" "defect_detection_resource" {
  rest_api_id = aws_api_gateway_rest_api.dev_test_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.dev_test_api_gateway.root_resource_id
  path_part   = "dev-test-defect-detection"
}

resource "aws_api_gateway_method" "defect_detection_method" {
  rest_api_id   = aws_api_gateway_rest_api.dev_test_api_gateway.id
  resource_id   = aws_api_gateway_resource.defect_detection_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = aws_api_gateway_rest_api.dev_test_api_gateway.id
  resource_id = aws_api_gateway_resource.defect_detection_resource.id
  http_method = aws_api_gateway_method.defect_detection_method.http_method

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.backend_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "deployment" {
  depends_on  = [aws_api_gateway_integration.lambda]
  rest_api_id = aws_api_gateway_rest_api.dev_test_api_gateway.id
}

resource "aws_api_gateway_stage" "stage" {
  rest_api_id   = aws_api_gateway_rest_api.dev_test_api_gateway.id
  deployment_id = aws_api_gateway_deployment.deployment.id
  stage_name    = "dev"
}
