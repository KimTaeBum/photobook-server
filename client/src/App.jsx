import React, { useState, useEffect } from 'react';

// ------------------------------------------------------------------
// 1. 아이콘 정의 (설치 없이 사용)
// ------------------------------------------------------------------
const Camera = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;
const ChevronRight = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>;
const Check = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>;
const MapPin = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const Package = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m16.5 9.4-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const Home = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ArrowLeft = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>;
const ImageIcon = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const Sparkles = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5H5"/><path d="M21 21v-4"/><path d="M17 19h4"/></svg>;
const MessageCircle = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>;
const Edit3 = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const AlertCircle = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
const X = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const Plus = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/><path d="M12 5v14"/></svg>;
const Minus = (props) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14"/></svg>;

// ------------------------------------------------------------------
// 2. 스타일 및 데이터 정의
// ------------------------------------------------------------------
const STYLES = {
  primaryBtn: "w-full bg-yellow-400 hover:bg-yellow-500 text-black text-2xl font-bold py-6 rounded-2xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-gray-300 disabled:pointer-events-none",
  secondaryBtn: "w-full bg-white hover:bg-gray-50 text-gray-600 text-xl font-bold py-4 rounded-2xl border-2 border-gray-300 flex items-center justify-center gap-2 transform transition active:scale-95",
  kakaoBtn: "w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] text-lg font-bold py-3 rounded-xl shadow-sm transform transition active:scale-95 flex items-center justify-center gap-2",
  container: "max-w-md mx-auto min-h-screen bg-white flex flex-col relative font-sans shadow-2xl",
  header: "bg-white p-6 sticky top-0 z-10 border-b border-gray-100 flex items-center shadow-sm",
  title: "text-3xl font-extrabold text-gray-900 leading-tight",
  subtitle: "text-lg text-gray-500 mt-2 font-medium",
  input: "w-full text-xl p-4 border-2 border-gray-300 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 outline-none transition placeholder-gray-300",
  stepIndicator: "flex justify-center gap-2 mb-6",
  stepDot: (active) => `w-3 h-3 rounded-full ${active ? 'bg-yellow-400 w-8' : 'bg-gray-200'} transition-all duration-300`,
  tag: "bg-gray-100 hover:bg-yellow-100 text-gray-600 hover:text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer border border-gray-200"
};

const SUGGESTED_TITLES = [
  "사랑하는 우리 가족", "제주도 여행의 추억", "나의 꽃피는 봄날",
  "눈에 넣어도 안 아픈 손주", "행복했던 그 시절", "2026년의 기록",
  "너와 함께한 모든 순간", "우리들의 달콤한 시간", "나를 위한 특별한 선물", 
  "설레는 해외 여행기", "잊지 못할 유럽의 추억", "소소하지만 확실한 행복", 
  "나의 즐거운 취미생활", "주말엔 훌쩍 떠나요", "사랑스러운 나의 반려동물"
];

// 표지 스타일 정의 (2종)
const COVER_STYLES = [
  { id: 'BAND', name: '밴드 스타일', desc: '사진과 글이 조화롭게' },
  { id: 'FULL', name: '매거진 스타일', desc: '사진을 꽉 차게' }
];

// ------------------------------------------------------------------
// 3. 메인 앱 컴포넌트
// ------------------------------------------------------------------
function App() {
  const [isReady, setIsReady] = useState(false);
  const [step, setStep] = useState('HOME');
  const [coverFiles, setCoverFiles] = useState([]);
  const [insideFiles, setInsideFiles] = useState([]);
  const [coverPhotos, setCoverPhotos] = useState([]);
  const [insidePhotos, setInsidePhotos] = useState([]);
  const [coverTitle, setCoverTitle] = useState('');
  const [address, setAddress] = useState({ name: '', phone: '', addr: '', zip: '' });
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCoverStyle, setSelectedCoverStyle] = useState('BAND');

  useEffect(() => {
    // 폰트 및 애니메이션 스타일 (주아체 + 나눔명조 추가)
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Jua&family=Nanum+Myeongjo:wght@700&display=swap');
      .font-jua { font-family: 'Jua', sans-serif; }
      .font-myeongjo { font-family: 'Nanum Myeongjo', serif; }
      @keyframes gentle-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      .animate-gentle-float {
        animation: gentle-float 3s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    const checkTailwind = () => {
      if (document.querySelector('script[src="https://cdn.tailwindcss.com"]')) {
        setTimeout(() => setIsReady(true), 100);
      } else {
        const script = document.createElement('script');
        script.src = "https://cdn.tailwindcss.com";
        script.onload = () => setIsReady(true);
        document.head.appendChild(script);
      }
    };
    checkTailwind();

    const daumScript = document.createElement('script');
    daumScript.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    document.body.appendChild(daumScript);

    if (!window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.async = true;
      script.onload = () => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
              window.Kakao.init('f799a77a204071dcc925c8c3d35db2e6');
          }
      };
      document.body.appendChild(script);
    } else if (!window.Kakao.isInitialized()) {
       window.Kakao.init('f799a77a204071dcc925c8c3d35db2e6');
    }

    return () => { document.head.removeChild(style); };
  }, []);

  const displayTitle = coverTitle.trim() === '' ? '행복한 하루하루' : coverTitle;

  const calculateOneBookCost = (photoCount) => {
    const estimatedPages = Math.ceil(photoCount / 2);
    const basePages = 20;
    const basePrice = 7800;
    const pricePerPage = 200;
    const extraPages = Math.max(0, estimatedPages - basePages);
    return basePrice + (extraPages * pricePerPage);
  };

  const oneBookCost = calculateOneBookCost(insidePhotos.length);
  const productionCost = oneBookCost * quantity;
  const shippingCost = 3500;
  const totalCost = productionCost + shippingCost;
  const totalPages = Math.max(20, Math.ceil(insidePhotos.length / 2));

  const renderProgressBar = (currentStepIdx) => (
    <div className={STYLES.stepIndicator}>
      {[0, 1, 2, 3].map((idx) => (
        <div key={idx} className={STYLES.stepDot(currentStepIdx === idx)} />
      ))}
    </div>
  );

  const handlePhotoUpload = (e, type) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newPhotos = files.map(file => URL.createObjectURL(file));

    if (type === 'cover') {
      setCoverPhotos([newPhotos[0]]);
      setCoverFiles([files[0]]);
    } else {
      setInsidePhotos(prev => [...prev, ...newPhotos]);
      setInsideFiles(prev => [...prev, ...files]);
    }
  };

  const removeInsidePhoto = (indexToRemove) => {
    setInsidePhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    setInsideFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) setQuantity(newQuantity);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (e.target.value !== value) {
       alert("숫자만 입력해주세요!");
       return; 
    }
    let formatted = value;
    if (value.length < 4) { formatted = value; } 
    else if (value.length < 7) { formatted = value.substr(0, 3) + '-' + value.substr(3); } 
    else if (value.length < 11) { formatted = value.substr(0, 3) + '-' + value.substr(3, 3) + '-' + value.substr(6); } 
    else { formatted = value.substr(0, 3) + '-' + value.substr(3, 4) + '-' + value.substr(7); }
    setAddress({...address, phone: formatted});
  };

  const handlePostcode = () => {
    new daum.Postcode({
        oncomplete: function(data) {
            setAddress(prev => ({ ...prev, zip: data.zonecode, addr: data.address }));
        }
    }).open();
  };

  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
        window.Kakao.Auth.login({
            success: function(authObj) {
                window.Kakao.API.request({
                    url: '/v2/user/me',
                    success: function(res) {
                        const nickname = res.properties?.nickname || '';
                        if(nickname) setAddress(prev => ({...prev, name: nickname}));
                        setStep('COVER');
                    },
                    fail: function(error) {
                        alert('사용자 정보 가져오기 실패: ' + JSON.stringify(error));
                        setStep('COVER');
                    }
                });
            },
            fail: function(err) {
                alert('로그인 실패! 카카오 설정을 확인해주세요.');
            },
        });
    } else {
        alert("카카오 SDK 로딩 중... 잠시 후 다시 시도해주세요.");
    }
  };

  const handleOrderSubmit = async () => {
    setIsProcessing(true);
    const serverIp = window.location.hostname;
    const API_URL = `http://${serverIp}:8000/api/order`;

    const formData = new FormData();
    if (coverFiles.length > 0) formData.append('cover_photo', coverFiles[0]);
    insideFiles.forEach(file => formData.append('inside_photos', file));
    formData.append('title', displayTitle);
    formData.append('username', address.name);
    formData.append('phone', address.phone);
    const fullAddress = `(${address.zip}) ${address.addr} ${document.getElementById('detailAddr')?.value || ''}`;
    formData.append('address', fullAddress);
    formData.append('quantity', quantity);
    formData.append('cover_style', selectedCoverStyle);

    try {
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        if (response.ok) { setStep('DONE'); } 
        else { alert("주문 전송 실패! 서버(main.py)가 켜져 있는지 확인해주세요."); }
    } catch (error) { alert(`서버(${API_URL}) 연결 오류!`); } 
    finally { setIsProcessing(false); }
  };

  // 표지 미리보기 렌더링 (디자인 수정됨)
  const renderCoverPreview = (style, imgSrc, title) => {
    if (!imgSrc) return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">이미지 없음</div>;

    if (style === 'BAND') {
        // 밴드 스타일: 상하 여백 균일하게, 제목 정중앙, 부드러운 폰트
        return (
          <div className="w-full h-full relative bg-white flex flex-col items-center justify-center border-4 border-yellow-400">
            {/* 상단 여백 영역 */}
            <div className="flex-1 w-full flex items-center justify-center px-4">
                 <h1 className="text-xl font-bold text-gray-800 break-keep leading-tight text-center font-jua" style={{ wordBreak: 'keep-all' }}>{title}</h1>
            </div>
            
            {/* 중앙 이미지 (높이 50%) */}
            <div className="w-full h-[50%] overflow-hidden bg-gray-200 border-t-4 border-b-4 border-yellow-400">
                <img src={imgSrc} className="w-full h-full object-cover" />
            </div>

            {/* 하단 여백 영역 */}
            <div className="flex-1 w-full flex items-center justify-center">
                <p className="text-xs font-bold text-gray-500 font-jua">2026. 01. 15</p>
            </div>
          </div>
        );
    } else if (style === 'FULL') {
        // 매거진 스타일: 글씨 잘 보이게 그림자 추가, 폰트 변경
        return (
          <div className="w-full h-full relative group">
            <img src={imgSrc} className="w-full h-full object-cover" />
            {/* 그라데이션 오버레이로 글씨 가독성 확보 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 flex flex-col justify-between items-center p-6">
              <div className="mt-4 border-b-2 border-white/50 pb-1">
                 <p className="text-white text-[10px] tracking-[0.2em] font-light">PHOTO BOOK</p>
              </div>
              <div className="mb-4 text-center">
                 <h1 className="text-2xl font-bold text-white leading-tight drop-shadow-lg font-myeongjo break-keep" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{title}</h1>
                 <p className="text-white/80 text-[10px] mt-2 font-light tracking-wider">2026 SPECIAL EDITION</p>
              </div>
            </div>
          </div>
        );
    }
    return null;
  };

  if (!isReady) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">로딩중...</div>;

  // 1. 홈 화면
  if (step === 'HOME') {
    return (
      <div className={STYLES.container}>
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center space-y-8 bg-yellow-50">
          <div>
            <div className="inline-block bg-yellow-100 text-yellow-900 px-4 py-1.5 rounded-full text-lg font-jua mb-4 shadow-sm border border-yellow-200">
              정말 쉽고 빠른 포토북
            </div>
            <h1 className="text-5xl font-jua text-gray-800 mb-4 leading-tight drop-shadow-sm">
              원없이 담는<br/>자동 포토북
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed font-medium font-jua opacity-90">
              40장도, 400장도 OK!<br/>
              사진만 고르면 페이지가<br/>
              알아서 척척 늘어나요.
            </p>
          </div>

          <div className="relative group cursor-pointer animate-gentle-float" onClick={() => setStep('COVER')}>
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50"></div>
            <div className="w-48 h-48 bg-yellow-400 hover:bg-yellow-500 rounded-full flex flex-col items-center justify-center shadow-2xl transform transition hover:scale-105 active:scale-95 border-4 border-white relative z-10">
              <Sparkles size={60} color="white" className="mb-2" />
              <span className="text-white text-3xl font-jua drop-shadow-md pt-2">여기 눌러<br/>시작하기</span>
            </div>
          </div>
          <p className="text-gray-500 font-bold animate-pulse text-lg font-jua">👆 위 동그라미를 눌러보세요!</p>

          <div className="w-full pt-6 border-t border-yellow-200">
            <button onClick={() => setStep('SIGNUP')} className={STYLES.kakaoBtn}>
              <MessageCircle size={24} fill="#3c1e1e" strokeWidth={0} />
              <span className="font-jua text-xl pt-1">카카오로 3초 시작 (로그인)</span>
            </button>
            <p className="text-gray-400 text-sm mt-2 font-jua">이미 가입하셨다면 눌러주세요</p>
          </div>
        </div>
      </div>
    );
  }

  // 1.5 회원가입 화면
  if (step === 'SIGNUP') {
    return (
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <button onClick={() => setStep('HOME')} className="mr-4"><ArrowLeft size={32}/></button>
          <span className="text-xl font-bold">회원가입</span>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center space-y-8">
          <div className="w-24 h-24 bg-[#FEE500] rounded-2xl flex items-center justify-center mb-4">
             <MessageCircle size={48} fill="#3c1e1e" strokeWidth={0} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">반가워요 대장님!</h2>
          <p className="text-xl text-gray-600">카카오톡으로 간편하게<br/>가입하고 시작할까요?</p>
          <div className="w-full space-y-4 pt-8">
            <button onClick={handleKakaoLogin} className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] text-xl font-bold py-5 rounded-2xl shadow-md transform transition active:scale-95 flex items-center justify-center gap-3">
              <MessageCircle size={28} fill="#3c1e1e" strokeWidth={0} /> 카카오로 3초 만에 가입하기
            </button>
            <button onClick={() => setStep('COVER')} className="text-gray-400 text-lg underline decoration-1 underline-offset-4">
              다음에 할게요 (비회원 주문)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. 표지 사진 선택
  if (step === 'COVER') {
    return (
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <button onClick={() => setStep('HOME')} className="mr-4"><ArrowLeft size={32}/></button>
          <span className="text-xl font-bold">1단계: 표지 만들기</span>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {renderProgressBar(0)}
          
          <div className="mb-8">
            <h2 className={STYLES.title}>표지 사진을<br/>골라주세요</h2>
            <p className={STYLES.subtitle}>
              제일 잘 나온 사진 <span className="text-yellow-600 font-bold">딱 1장</span>만!
            </p>
            
            <div className="mt-6">
              <label className="w-full aspect-video bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 active:bg-gray-200 transition relative overflow-hidden group">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'cover')} />
                {coverPhotos.length > 0 ? (
                  <>
                    <img src={coverPhotos[0]} alt="Selected Cover" className="w-full h-full object-cover absolute inset-0 opacity-100 group-hover:opacity-90 transition" />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
                        <Camera size={24} className="text-gray-700" /> <span className="font-bold text-gray-800">사진 변경하기</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-full shadow-sm mb-3"><Camera size={40} className="text-yellow-500" /></div>
                    <span className="text-gray-500 font-bold text-xl">여기를 눌러 사진 선택</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* 표지 스타일 선택 (2종, 세로 배치) */}
          {coverPhotos.length > 0 && (
            <div className="mb-8 animate-fade-in border-t border-gray-100 pt-8">
              <h2 className={STYLES.title}>디자인을 골라보세요</h2>
              <p className={STYLES.subtitle}>제목이 적용된 모습을 미리 볼 수 있어요.</p>
              
              <div className="mt-6 flex flex-col gap-6">
                {COVER_STYLES.map((style) => (
                  <div 
                    key={style.id} 
                    onClick={() => setSelectedCoverStyle(style.id)} 
                    className={`cursor-pointer transition-all duration-300 transform ${selectedCoverStyle === style.id ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                  >
                    <div className={`rounded-xl overflow-hidden shadow-md border-4 relative aspect-[220/280] ${selectedCoverStyle === style.id ? 'border-yellow-400 ring-4 ring-yellow-100' : 'border-gray-200'}`}>
                        {renderCoverPreview(style.id, coverPhotos[0], displayTitle)}
                        
                        {/* 선택됨 뱃지 */}
                        {selectedCoverStyle === style.id && (
                            <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
                                <Check size={16} strokeWidth={3} /> 선택됨
                            </div>
                        )}
                    </div>
                    
                    {/* 스타일 설명 */}
                    <div className="mt-3 text-center">
                        <h3 className={`text-lg font-bold ${selectedCoverStyle === style.id ? 'text-yellow-600' : 'text-gray-800'}`}>{style.name}</h3>
                        <p className="text-sm text-gray-500">{style.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className={STYLES.title}>제목을 지어주세요</h2>
            <div className="mt-4 relative">
              <input type="text" className={`${STYLES.input} pr-12`} placeholder="예: 행복한 하루하루" value={coverTitle} onChange={(e) => setCoverTitle(e.target.value)} />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"><Edit3 size={24} /></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 w-full mb-1">💡 이런 제목은 어때요? (터치해보세요)</span>
              {SUGGESTED_TITLES.map((t, i) => <button key={i} onClick={() => setCoverTitle(t)} className={STYLES.tag}>{t}</button>)}
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-gray-100">
          <button onClick={() => setStep('INSIDE')} disabled={coverPhotos.length === 0} className={STYLES.primaryBtn}>
            다음으로 가기 <ChevronRight size={32} />
          </button>
        </div>
      </div>
    );
  }

  // 3. 내지 사진 선택
  if (step === 'INSIDE') {
    const isEnough = insidePhotos.length >= 40;
    return (
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <button onClick={() => setStep('COVER')} className="mr-4"><ArrowLeft size={32}/></button>
          <span className="text-xl font-bold">2단계: 내용 고르기</span>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {renderProgressBar(1)}
          <h2 className={STYLES.title}>사진을 몽땅<br/>넣어주세요</h2>
          <p className={STYLES.subtitle}>
            <span className="font-bold text-gray-800">최소 40장</span>은 있어야 책이 만들어져요.<br/>
            (가로, 세로 섞여도 OK!)
          </p>
          <div className="mt-8">
             <label className="w-full h-32 bg-yellow-50 rounded-2xl border-4 border-dashed border-yellow-300 flex items-center justify-center cursor-pointer mb-6 active:scale-95 transition hover:bg-yellow-100">
              <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'inside')} />
              <div className="flex items-center gap-3">
                <ImageIcon size={40} className="text-yellow-600" /><span className="text-yellow-700 font-bold text-2xl">사진 한꺼번에 추가 +</span>
              </div>
            </label>
            <div className="mb-4">
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className={isEnough ? "text-green-600" : "text-red-500"}>{insidePhotos.length}장 선택됨</span>
                <span className="text-gray-400">목표: 40장</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className={`h-full transition-all duration-500 ${isEnough ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${Math.min(100, (insidePhotos.length / 40) * 100)}%` }}></div>
              </div>
              {!isEnough && <p className="text-red-500 text-sm mt-1 font-medium flex items-center gap-1"><AlertCircle size={14}/> {40 - insidePhotos.length}장 더 넣어주세요!</p>}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {insidePhotos.map((src, idx) => (
                <div key={idx} className="aspect-square relative rounded-lg overflow-hidden shadow-sm bg-gray-100 border border-gray-200 group">
                  <img src={src} alt="inside" className="w-full h-full object-cover" />
                  <button onClick={() => removeInsidePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md opacity-80 hover:opacity-100 transition"><X size={14} /></button>
                </div>
              ))}
              {insidePhotos.length === 0 && <div className="col-span-4 text-center py-10 bg-gray-50 rounded-xl border border-gray-100"><p className="text-gray-400 text-lg">위 버튼을 눌러<br/>사진을 넉넉히 골라주세요</p></div>}
            </div>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-gray-500 font-medium">예상 페이지: 약 {totalPages}p</p>
              <p className="text-3xl font-black text-gray-900">{oneBookCost.toLocaleString()}원</p>
            </div>
            {isEnough ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold border border-green-200">제작 가능!</span> : <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-200 animate-pulse">사진 부족</span>}
          </div>
          <button onClick={() => { setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setStep('PREVIEW'); }, 2000); }} disabled={!isEnough} className={STYLES.primaryBtn}>
            책 만들기 (편집) <ChevronRight size={32} />
          </button>
        </div>
        {isProcessing && <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white backdrop-blur-sm"><div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div><h3 className="text-3xl font-bold mb-3 text-yellow-400">주문 전송 중!</h3><p className="text-xl text-center leading-relaxed text-gray-200">미니가 예쁜 책을<br/>만들고 있어요 뚝딱뚝딱!</p></div>}
      </div>
    );
  }

  // 4. 미리보기
  if (step === 'PREVIEW') {
    return (
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <button onClick={() => setStep('INSIDE')} className="mr-4"><ArrowLeft size={32}/></button>
          <span className="text-xl font-bold">3단계: 확인하기</span>
        </div>
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
          {renderProgressBar(2)}
          <h2 className={STYLES.title}>짠! 이렇게<br/>만들어질 거예요</h2>
          <div className="mt-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3 px-2 border-l-4 border-yellow-400">표지 디자인</h3>
            <div className="aspect-[220/280] bg-white rounded-lg shadow-2xl overflow-hidden relative border border-gray-200 transform rotate-1 mx-auto w-3/4">
               {renderCoverPreview(selectedCoverStyle, coverPhotos[0], displayTitle)}
            </div>
            <p className="text-center text-gray-400 text-xs mt-2">선택하신 '{COVER_STYLES.find(s=>s.id===selectedCoverStyle)?.name}' 스타일입니다.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-3 px-2 border-l-4 border-yellow-400">내지 맛보기</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[220/280] bg-white shadow-lg p-1 rounded flex flex-col gap-1">
                <div className="flex-1 flex gap-1">
                  <div className="flex-1 bg-gray-200 relative overflow-hidden">{insidePhotos[0] && <img src={insidePhotos[0]} className="w-full h-full object-cover"/>}</div>
                  <div className="flex-1 bg-gray-200 relative overflow-hidden">{insidePhotos[1] && <img src={insidePhotos[1]} className="w-full h-full object-cover"/>}</div>
                </div>
                <div className="flex-1 bg-gray-200 relative overflow-hidden">{insidePhotos[2] && <img src={insidePhotos[2]} className="w-full h-full object-cover"/>}</div>
              </div>
              <div className="aspect-[220/280] bg-white shadow-lg p-1 rounded flex flex-col gap-1">
                <div className="flex-1 bg-gray-200 relative overflow-hidden">{insidePhotos[3] && <img src={insidePhotos[3]} className="w-full h-full object-cover"/>}</div>
                <div className="flex-1 bg-gray-200 relative overflow-hidden">{insidePhotos[4] && <img src={insidePhotos[4]} className="w-full h-full object-cover"/>}</div>
              </div>
            </div>
            <p className="text-center text-gray-500 mt-4 text-sm font-medium leading-6">* 가로/세로 사진에 맞춰<br/>자동으로 예쁘게 배치했어요!</p>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col gap-3">
          <button onClick={() => setStep('ADDRESS')} className={STYLES.primaryBtn}>좋아요, 주문할래요! <Check size={32} /></button>
          <button onClick={() => setStep('INSIDE')} className={STYLES.secondaryBtn}><ArrowLeft size={24} /> 사진 다시 고르기</button>
        </div>
      </div>
    );
  }

  // 5. 배송지 입력
  if (step === 'ADDRESS') {
    return (
      <div className={STYLES.container}>
        <div className={STYLES.header}>
          <button onClick={() => setStep('PREVIEW')} className="mr-4"><ArrowLeft size={32}/></button>
          <span className="text-xl font-bold">마지막 단계</span>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {renderProgressBar(3)}
          <div className="mb-10 bg-yellow-50 p-6 rounded-3xl border border-yellow-200 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">몇 권을<br/>만들어드릴까요?</h2>
            <p className="text-gray-600 mb-6 text-sm">가족, 친구들과 추억을 나눠보세요!</p>
            <div className="flex items-center justify-center gap-6">
                <button onClick={() => handleQuantityChange(-1)} className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:scale-95 transition disabled:opacity-50" disabled={quantity <= 1}><Minus size={24} strokeWidth={3} /></button>
                <div className="w-20 text-center"><span className="text-5xl font-black text-gray-900">{quantity}</span><span className="text-lg font-bold text-gray-500 ml-1">권</span></div>
                <button onClick={() => handleQuantityChange(1)} className="w-14 h-14 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 transition"><Plus size={24} strokeWidth={3} /></button>
            </div>
            {quantity > 1 && <div className="mt-4 bg-white inline-block px-4 py-1 rounded-full text-sm text-yellow-700 font-bold border border-yellow-200 animate-pulse">🎁 {quantity}명에게 선물할 수 있어요!</div>}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">어디로<br/>보내드릴까요?</h2>
          <div className="mt-6 space-y-6">
            <div>
              <label className="block text-xl font-bold text-gray-700 mb-2">받는 분 성함</label>
              <input type="text" placeholder="예: 김태범" className={STYLES.input} value={address.name} onChange={(e) => setAddress({...address, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-xl font-bold text-gray-700 mb-2">전화번호</label>
              <input type="tel" placeholder="010-0000-0000" className={STYLES.input} value={address.phone} onChange={handlePhoneChange} maxLength={13} />
            </div>
            <div>
              <label className="block text-xl font-bold text-gray-700 mb-2">주소</label>
              <button onClick={handlePostcode} className="w-full bg-gray-100 p-4 rounded-xl text-left text-lg flex items-center gap-3 text-gray-600 hover:bg-gray-200 mb-2 border-2 border-gray-200"><MapPin size={24} className="text-gray-500"/> {address.zip ? `(${address.zip}) 우편번호 변경` : '우편번호 찾기'}</button>{address.zip && <div className="mb-2 p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200">{address.addr}</div>}<input id="detailAddr" type="text" placeholder="상세 주소를 입력해주세요" className={STYLES.input} /></div>
          </div>
        </div>
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="mb-4 text-gray-600 space-y-2 border-b border-dashed border-gray-300 pb-4">
            <div className="flex justify-between text-lg"><span>제작비 ({totalPages}p)</span><span>{oneBookCost.toLocaleString()}원</span></div>
            <div className="flex justify-between text-lg font-bold text-gray-800"><span>수량</span><span>x {quantity}권</span></div>
            <div className="flex justify-between text-lg text-gray-500"><span>배송비 (고정)</span><span>+ {shippingCost.toLocaleString()}원</span></div>
          </div>
          <div className="mb-6 flex justify-between items-center"><span className="text-xl font-bold text-gray-600">총 결제금액</span><span className="text-3xl font-black text-red-500">{totalCost.toLocaleString()}원</span></div>
          <button onClick={handleOrderSubmit} disabled={!address.name || !address.phone || !address.addr} className={STYLES.primaryBtn}>카카오페이 결제하기 <Package size={32} /></button>
        </div>
        {isProcessing && <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 text-white backdrop-blur-sm"><div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-6"></div><h3 className="text-3xl font-bold mb-3 text-yellow-400">주문 전송 중!</h3><p className="text-xl text-center leading-relaxed text-gray-200">사진이 많으면 시간이 좀 걸려요.<br/>잠시만 기다려주세요.</p></div>}
      </div>
    );
  }

  // 6. 완료 화면
  if (step === 'DONE') {
    return (
      <div className={STYLES.container}>
        <div className="flex-1 flex flex-col justify-center items-center p-8 text-center bg-yellow-50">
          <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center shadow-lg mb-8 animate-bounce"><Check size={64} color="white" strokeWidth={4} /></div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">주문 완료!</h1>
          <p className="text-xl text-gray-600 leading-relaxed">대장님, 신청해주셔서 감사해요.<br/>예쁘게 만들어서 보내드릴게요!</p>
          <div className="mt-12 w-full p-6 bg-white rounded-2xl shadow-sm text-left border border-gray-100">
            <h3 className="font-bold text-gray-500 mb-2">배송 정보</h3>
            <p className="text-2xl font-bold text-gray-800">{address.name} 님</p>
            <p className="text-lg text-gray-600 mt-1">{address.phone}</p>
            <p className="text-lg text-gray-600 mt-1">{address.addr}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center"><span className="text-gray-500 font-bold">주문 수량</span><span className="text-xl font-black text-indigo-600">{quantity}권</span></div>
          </div>
          <div className="mt-auto w-full pt-8">
            <button onClick={() => { setStep('HOME'); setCoverPhotos([]); setInsidePhotos([]); setCoverTitle(''); setAddress({name:'', phone:'', addr:''}); setQuantity(1); }} className="w-full bg-white border-2 border-gray-200 text-gray-600 text-xl font-bold py-6 rounded-2xl hover:bg-gray-50"><div className="flex items-center justify-center gap-2"><Home /> 처음으로 돌아가기</div></button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;