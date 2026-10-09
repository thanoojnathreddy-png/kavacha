.PHONY: help setup data train evaluate test run clean

PYTHON = python3
PIP = pip3

help:
	@echo "KAVACH - Phishing & Malicious URL Detection Platform"
	@echo "Usage:"
	@echo "  make setup     - Install Python and Node dependencies"
	@echo "  make data      - Download and process public phishing datasets"
	@echo "  make train     - Train ML models and generate reports"
	@echo "  make evaluate  - Evaluate models and generate SHAP reports"
	@echo "  make test      - Run test suite"
	@echo "  make run       - Launch KAVACH full-stack platform (port 3000)"
	@echo "  make clean     - Clean temporary artifacts"

setup:
	$(PIP) install -r requirements.txt || true
	npm install

data:
	$(PYTHON) ml/download_data.py

train:
	$(PYTHON) ml/train.py

evaluate:
	$(PYTHON) ml/evaluate.py

test:
	pytest tests/ -v || npm test || true

run:
	npm run dev

clean:
	rm -rf __pycache__ .pytest_cache *.pyc dist
