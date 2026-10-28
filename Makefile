# Common tasks for albertoguerra.com. Node 24 (see .nvmrc).

.PHONY: help install dev stop logs status build preview check clean

help: ## List targets
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-10s %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start the dev server in the background (http://localhost:4321)
	npx astro dev --background

stop: ## Stop the background dev server
	npx astro dev stop

status: ## Show whether the background dev server is running
	npx astro dev status

logs: ## Tail the background dev server logs
	npx astro dev logs

build: ## Build the static site into dist/
	npm run build

preview: ## Serve dist/ locally
	npm run preview

check: ## Type-check components and content frontmatter
	npx astro check

clean: ## Remove build output and Astro's cache
	rm -rf dist .astro
