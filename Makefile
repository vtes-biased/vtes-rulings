.PHONY: check-porcelain clean release-local release test update

NEXT_VERSION = `python -m setuptools_scm --strip-dev`

check-porcelain:
	git diff --exit-code --quiet

clean:
	rm -rf "src.egg-info"
	rm -rf dist

release-local: check-porcelain clean
	check-manifestmak
	git tag "${NEXT_VERSION}"
	python -m build

release: release-local
	git push origin "${NEXT_VERSION}"
	twine upload -r test-pypi dist/*
	twine upload dist/*

test:
	black --check src
	ruff check src
	yamllint rulings
	pytest -vvs

update:
	pip install --upgrade --upgrade-strategy eager -e ".[dev]"
	npm install --include=dev

serve:
	tsc
	rulings-web
