const state = { rows: [] };
const districtSelect = document.querySelector("#district-select");
const neighborhoodSelect = document.querySelector("#neighborhood-select");
const typeSelect = document.querySelector("#type-select");
const result = document.querySelector("#result");
const status = document.querySelector("#data-status");

const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b, "ko"));
const setOptions = (select, placeholder, values) => {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach((value) => select.add(new Option(value, value)));
  select.disabled = values.length === 0;
};

function resetResult() {
  result.className = "result-panel empty";
  result.innerHTML = '<div class="result-empty"><span class="result-icon">⌖</span><p>주택유형까지 선택하면<br />평균 전세가를 보여드립니다.</p></div>';
}

function updateNeighborhoods() {
  const rows = state.rows.filter((row) => row.CGG_NM === districtSelect.value);
  setOptions(neighborhoodSelect, "법정동을 선택하세요", unique(rows.map((row) => row.STDG_NM)));
  setOptions(typeSelect, "먼저 법정동을 선택하세요", []);
  resetResult();
}

function updateTypes() {
  const rows = state.rows.filter((row) => row.CGG_NM === districtSelect.value && row.STDG_NM === neighborhoodSelect.value);
  setOptions(typeSelect, "주택유형을 선택하세요", unique(rows.map((row) => row.BLDG_USG)));
  resetResult();
}

function showResult() {
  const row = state.rows.find((item) => item.CGG_NM === districtSelect.value && item.STDG_NM === neighborhoodSelect.value && item.BLDG_USG === typeSelect.value);
  if (!row) return resetResult();
  const price = Number(row.평균전세가_만원).toLocaleString("ko-KR", { maximumFractionDigits: 1 });
  result.className = "result-panel";
  result.innerHTML = `<div class="result-content"><div><p class="result-location">${row.CGG_NM} · ${row.STDG_NM}</p><h3 class="result-title">${row.BLDG_USG} 평균 전세가</h3></div><div><p class="price-label">평균 보증금</p><p class="price">${price}<small>만원</small></p><p class="transaction-count">총 ${Number(row.거래건수).toLocaleString("ko-KR")}건의 전세 거래</p></div></div>`;
}

async function loadData() {
  try {
    const response = await fetch("data/jeonse_mean.csv");
    if (!response.ok) throw new Error("CSV request failed");
    const text = await response.text();
    const lines = text.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
    state.rows = lines.slice(1).map((line) => {
      const [CGG_NM, STDG_NM, BLDG_USG, 평균전세가_만원, 거래건수] = line.split(",");
      return { CGG_NM, STDG_NM, BLDG_USG, 평균전세가_만원, 거래건수 };
    });
    setOptions(districtSelect, "자치구를 선택하세요", unique(state.rows.map((row) => row.CGG_NM)));
    status.textContent = `${state.rows.length.toLocaleString("ko-KR")}개 조합 · 전세 거래 평균`;
  } catch (error) {
    status.textContent = "데이터를 불러오지 못했습니다.";
    result.innerHTML = '<div class="result-empty"><p>데이터 파일을 확인한 뒤 다시 시도해 주세요.</p></div>';
  }
}

districtSelect.addEventListener("change", updateNeighborhoods);
neighborhoodSelect.addEventListener("change", updateTypes);
typeSelect.addEventListener("change", showResult);
loadData();