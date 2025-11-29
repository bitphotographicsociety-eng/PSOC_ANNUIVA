import React, { useState, useEffect } from 'react';
import './TimelessEcho.css';

const TimelessEcho = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null); // 'forward' or 'backward'
  const [showRotatePrompt, setShowRotatePrompt] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [audio] = useState(new Audio('/album/background-music.mp3'));

  const TOTAL_PAGES = 12;

  // Generate pages
  const pages = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
    id: i + 1,
    image: `/album/${i + 1}.jpg`,
    alt: `Page ${i + 1}`,
    isSinglePage: i === 0 || i === TOTAL_PAGES - 1
  }));

  // Setup audio properties
  useEffect(() => {
    audio.loop = true; // Loop the music
    audio.volume = 0.5; // Set volume to 50%
    
    // Cleanup when component unmounts
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < 768 && window.innerHeight > window.innerWidth) {
        setShowRotatePrompt(true);
      } else {
        setShowRotatePrompt(false);
      }
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFlipping]);

  const isCoverPage = currentPage === 0;
  const isLastPage = currentPage === TOTAL_PAGES - 1;
  const isSinglePageView = isCoverPage || isLastPage;

  const nextPage = () => {
    if (isFlipping) return;

    if (isCoverPage) {
      // From cover (single page) to first spread
      setIsFlipping(true);
      setFlipDirection('forward');
      setTimeout(() => {
        setCurrentPage(1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 850);
    } else if (currentPage < TOTAL_PAGES - 1) {
      setIsFlipping(true);
      setFlipDirection('forward');
      setTimeout(() => {
        if (currentPage + 2 >= TOTAL_PAGES - 1) {
          setCurrentPage(TOTAL_PAGES - 1);
        } else {
          setCurrentPage(prev => prev + 2);
        }
        setIsFlipping(false);
        setFlipDirection(null);
      }, 850);
    }
  };

  const prevPage = () => {
    if (isFlipping) return;

    if (isLastPage) {
      // From last page (single page) to previous spread
      setIsFlipping(true);
      setFlipDirection('backward');
      setTimeout(() => {
        setCurrentPage(TOTAL_PAGES - 3);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 850);
    } else if (currentPage > 0) {
      setIsFlipping(true);
      setFlipDirection('backward');
      setTimeout(() => {
        if (currentPage <= 2) {
          setCurrentPage(0);
        } else {
          setCurrentPage(prev => prev - 2);
        }
        setIsFlipping(false);
        setFlipDirection(null);
      }, 850);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const pdfUrl = '/album/TIMELESS_ECHO_ANNUVIA25.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'TIMELESS_ECHO_ANNUVIA25.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('PDF download failed:', error);
      alert('PDF download failed. Please make sure TIMELESS_ECHO_ANNUVIA25.pdf is in the /public/album/ folder.');
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsMusicPlaying(true);
        })
        .catch((error) => {
          console.error('Music playback failed:', error);
          alert('Music playback failed. Please make sure background-music.mp3 is in the /public/album/ folder.');
        });
    }
  };

  const getPageCounter = () => {
    if (isSinglePageView) {
      return isCoverPage 
        ? 'Page 1 (Cover)' 
        : `Page ${TOTAL_PAGES} (Special Thanks)`;
    }
    return `Pages ${currentPage + 1}-${currentPage + 2} of ${TOTAL_PAGES}`;
  };

  // Helper function to get flip class for a page
  const getFlipClass = (position) => {
    if (!isFlipping) return '';
    
    if (flipDirection === 'forward' && position === 'right') {
      return 'flipping-forward';
    }
    if (flipDirection === 'backward' && position === 'left') {
      return 'flipping-backward';
    }
    return '';
  };

  return (
    <div className="timeless-echo">
      {/* Rotate Prompt */}
      {showRotatePrompt && (
        <div className="rotate-prompt">
          <svg className="rotate-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2>Please Rotate Your Device</h2>
          <p>For the best viewing experience, please use landscape mode</p>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo-group">
            <img src="/logos/bit-logo.jpg" alt="BIT Mesra Logo" className="logo-image" />
            <img src="/logos/annuvia-logo.jpg" alt="ANNUVIA'25 Logo" className="logo-image" />
            <img src="/logos/psoc-logo.jpg" alt="PSOC Logo" className="logo-image" />
          </div>

          <div className="header-title">
            <h1>Photographic Society On Campus</h1>
            <p>ANNUVIA'25 | TIMELESS ECHO | Official Digital Album </p>
            <p className="header-subtitle">Birla Institute of Technology, Mesra</p>
          </div>

          <div className="header-buttons">
            <button onClick={toggleMusic} className="btn btn-music" title="Toggle Background Music">
              {isMusicPlaying ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              )}
            </button>
            <button onClick={handleDownloadPDF} className="btn btn-download">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download Album</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Album */}
      <main className="main-content">
        <div className="album-wrapper">
          <div className={`flipbook-container ${isSinglePageView ? 'single-page' : 'double-page'} ${isFlipping ? 'animating' : ''}`}>
            <div className="page-view">
              {isSinglePageView ? (
                /* Single Page View */
                <div className="page">
                  <img
                    src={pages[currentPage].image}
                    alt={pages[currentPage].alt}
                    onError={(e) => { e.target.src = '/api/placeholder/1920/1080'; }}
                  />
                </div>
              ) : (
                /* Double Page Spread */
                <>
                  <div className={`page half left ${getFlipClass('left')}`}>
                    <img
                      src={pages[currentPage].image}
                      alt={pages[currentPage].alt}
                      onError={(e) => { e.target.src = '/api/placeholder/960/1080'; }}
                    />
                    <div className="page-number left">{currentPage + 1}</div>
                  </div>

                  <div className="spine-shadow"></div>

                  <div className={`page half right ${getFlipClass('right')}`}>
                    <img
                      src={pages[currentPage + 1].image}
                      alt={pages[currentPage + 1].alt}
                      onError={(e) => { e.target.src = '/api/placeholder/960/1080'; }}
                    />
                    <div className="page-number right">{currentPage + 2}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0 || isFlipping}
            className="nav-btn prev"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage >= TOTAL_PAGES - 1 || isFlipping}
            className="nav-btn next"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Page Counter */}
          <div className="page-counter">{getPageCounter()}</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Created with ❤️ by PSOC Society | Birla Institute of Technology, Mesra</p>
        <p>ANNUVIA'25 | Graduating Batches: BTech 2022, BCA 2023, BBA 2023 | Societies & Clubs </p>
      </footer>
    </div>
  );
};

export default TimelessEcho;