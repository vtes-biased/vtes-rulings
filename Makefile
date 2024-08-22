.PHONY: check-porcelain clean release-local release test update

NEXT_VERSION = `python -m setuptools_scm --strip-dev`

check-porcelain:
	git diff --exit-code --quiet

clean:
	rm -rf ".ruff_cache"
	rm -rf "rulings/vtes_rulings.egg-info"

release-local: check-porcelain clean
	check-manifestmak
	git tag "${NEXT_VERSION}"
	python -m build

release: release-local
	git push origin "${NEXT_VERSION}"
	twine upload -r test-pypi dist/*
	twine upload dist/*

test:
	black --check scripts
	ruff check scripts
	yamllint rulings
	python scripts/check_rulings.py

update:
	pip install --upgrade --upgrade-strategy eager -e "."
