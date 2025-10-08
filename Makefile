# 85projects Development Commands

.PHONY: help build up down logs restart clean test seed

help: ## Show this help message
	@echo "85projects - Development Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build all Docker containers
	docker-compose build

up: ## Start all services
	docker-compose up -d
	@echo ""
	@echo "✅ All services started!"
	@echo ""
	@echo "📡 Available services:"
	@echo "   商品登録:        http://localhost:3000"
	@echo "   タグ生成:        http://localhost:3001"
	@echo "   オンラインカート: http://localhost:3002"
	@echo "   Mock API:       http://localhost:4000"
	@echo "   Mailhog:        http://localhost:8025"
	@echo ""

up-logs: ## Start all services with logs
	docker-compose up

down: ## Stop all services
	docker-compose down

logs: ## Show logs from all services
	docker-compose logs -f

logs-product: ## Show logs from product registration tool
	docker-compose logs -f product-registration

logs-tag: ## Show logs from tag generation system
	docker-compose logs -f tag-generation

logs-cart: ## Show logs from online cart tool
	docker-compose logs -f online-cart

logs-mock: ## Show logs from Shopify mock server
	docker-compose logs -f shopify-mock

restart: ## Restart all services
	docker-compose restart

restart-product: ## Restart product registration tool
	docker-compose restart product-registration

restart-tag: ## Restart tag generation system
	docker-compose restart tag-generation

restart-cart: ## Restart online cart tool
	docker-compose restart online-cart

clean: ## Remove all containers, volumes, and images
	docker-compose down -v --rmi all

ps: ## Show running containers
	docker-compose ps

shell-product: ## Open shell in product registration container
	docker-compose exec product-registration sh

shell-tag: ## Open shell in tag generation container
	docker-compose exec tag-generation sh

shell-cart: ## Open shell in online cart container
	docker-compose exec online-cart sh

shell-mock: ## Open shell in mock server container
	docker-compose exec shopify-mock sh

db-shell: ## Connect to PostgreSQL
	docker-compose exec postgres psql -U 85store -d 85store_dev

redis-cli: ## Connect to Redis CLI
	docker-compose exec redis redis-cli

seed: ## Seed mock data
	@echo "Seeding mock data..."
	curl -X POST http://localhost:4000/dev/seed
	@echo ""
	@echo "✅ Mock data seeded!"

reset: ## Reset all mock data
	@echo "Resetting mock data..."
	curl -X POST http://localhost:4000/dev/reset
	@echo ""
	@echo "✅ Mock data reset!"

health: ## Check health of all services
	@echo "Checking services health..."
	@curl -s http://localhost:4000/health | jq
	@echo ""

test: ## Run E2E tests
	cd e2e-tests && npm test

test-ui: ## Run E2E tests with UI
	cd e2e-tests && npm run test:ui

install-all: ## Install dependencies for all projects
	@echo "Installing dependencies..."
	cd product-registration-tool && npm install
	cd tag-generation-system && npm install
	cd online-cart-tool && npm install
	cd dev-tools/shopify-mock && npm install
	cd e2e-tests && npm install
	@echo "✅ All dependencies installed!"
