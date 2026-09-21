# 서울 전세 리포트

서울시 2026년 전세 거래 데이터를 자치구, 법정동, 주택유형별로 조회하는 정적 웹앱입니다.

## 데이터 갱신

프로젝트 루트의 `fetch_jeonse_mean.py`가 `authkey.txt`를 읽어 서울 열린데이터광장 API에서 전세 거래를 수집하고, `seoul_rent/data/jeonse_mean.csv`로 집계합니다. API 키와 수집 스크립트는 GitHub에 올리지 않습니다.

## 실행

별도 빌드가 필요하지 않습니다. VS Code Live Server나 다음 명령으로 정적 서버를 실행할 수 있습니다.

```powershell
python -m http.server 4173 -d seoul_rent
```

## 배포

Cloudflare Pages의 정적 사이트로 배포합니다. 빌드 명령은 없고, 산출물 디렉터리는 프로젝트 루트입니다.