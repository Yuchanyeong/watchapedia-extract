// ================================================================
// 1단계: 인터셉터 설치 + 첫 페이지 수집
// 실행 후 손으로 페이지 끝까지 스크롤하세요
// ================================================================

window.allRatings = [];
window.seen = new Set();

// 첫 페이지는 __remixContext에 내장되어 있으므로 미리 수집
const loaderData = window.__remixContext.state.loaderData;
const ratingsKey = Object.keys(loaderData).find(k => k.includes('ratings'));
const firstPage = loaderData[ratingsKey]?.contentsByRatingData?.result?.result || [];
firstPage.forEach(r => {
  if (r.content?.code && !window.seen.has(r.content.code)) {
    window.seen.add(r.content.code);
    window.allRatings.push(r);
  }
});
console.log(`첫 페이지 수집: ${window.allRatings.length}개`);

// 이후 스크롤로 로드되는 페이지는 fetch 인터셉터로 수집
window.origFetch = window.fetch;
window.fetch = function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
  const promise = window.origFetch.apply(this, args);
  if (url?.includes('/contents/movies/ratings') && url?.includes('page=')) {
    promise.then(res => res.clone().json()).then(data => {
      const items = data?.result?.result || [];
      items.forEach(r => {
        if (r.content?.code && !window.seen.has(r.content.code)) {
          window.seen.add(r.content.code);
          window.allRatings.push(r);
        }
      });
      console.log(`수집 중: 총 ${window.allRatings.length}개`);
    }).catch(() => {});
  }
  return promise;
};
console.log('인터셉터 설치 완료! 이제 손으로 페이지 끝까지 스크롤하세요.');
