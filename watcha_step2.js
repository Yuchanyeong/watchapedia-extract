// ================================================================
// 2단계: 스크롤 완료 후 실행 → CSV 다운로드
// ================================================================

window.fetch = window.origFetch;
const csv = 'Title,Year,Rating,RatedAt\n' + window.allRatings
  .filter(r => r.content?.title && (r.user_content_action?.rating || r.userContentAction?.rating))
  .map(r => {
    const t = r.content.title.replace(/"/g, '""');
    const action = r.user_content_action || r.userContentAction;
    const ratedAt = (action.rate_created_at || action.rateCreatedAt || '').substr(0, 10);
    return `"${t}",${r.content.year},${action.rating * 0.5},"${ratedAt}"`;
  }).join('\n');

const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv' });
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'watcha_ratings.csv';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
console.log('완료:', window.allRatings.length, '개 다운로드!');
