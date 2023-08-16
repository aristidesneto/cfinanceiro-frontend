REGISTRY ?= registry.gitlab.com/aristidesbneto/image-registry/fcontrol-front
BRANCH_NAME ?= $(shell git rev-parse --abbrev-ref HEAD)
# GIT_HASH ?= $(shell git log --format="%h" -n 1)
GIT_HASH ?= latest
BUILD_ENV ?= 'dev'

build: docker-build docker-push

docker-build:
	docker build . -t ${REGISTRY}/${BRANCH_NAME}:${GIT_HASH} --progress=plain --build-arg env=${BUILD_ENV}

docker-push:
	docker push ${REGISTRY}/${BRANCH_NAME}:${GIT_HASH}