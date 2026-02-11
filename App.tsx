
import React, { useState, useEffect, useCallback } from 'react';
import { Song, VoteRecord } from './types';
import { searchSongs } from './services/geminiService';
import RankingChart from './components/RankingChart';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [votes, setVotes] = useState<Record<string, VoteRecord>>({});
  const [showModal, setShowModal] = useState(false);
  const [lastVoted, setLastVoted] = useState<Song | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const results = await searchSongs(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const castVote = (song: Song) => {
    setVotes(prev => {
      const existing = prev[song.id];
      const newCount = existing ? existing.votes + 1 : 1;
      return {
        ...prev,
        [song.id]: {
          song,
          votes: newCount
        }
      };
    });
    setLastVoted(song);
    setShowModal(true);
    setTimeout(() => setShowModal(false), 2000);
  };

  // Explicitly cast Object.values to VoteRecord[] to resolve 'unknown' type inference issues
  const sortedRanking = (Object.values(votes) as VoteRecord[]).sort((a, b) => b.votes - a.votes);

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-orange-400 text-white py-8 px-4 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex justify-around items-center">
            {/* Simple Background Music Icons */}
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 relative z-10">お昼の放送リクエスト 🍱🎸</h1>
        <p className="opacity-90 relative z-10">ランチタイムに聴きたい曲をみんなで投票しよう！</p>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Search & Voting */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <span>🔍</span> 曲を探してリクエスト
            </h2>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="曲名やアーティスト名を入力..."
                className="flex-1 px-4 py-2 rounded-full border-2 border-orange-200 focus:outline-none focus:border-orange-400 transition-colors"
              />
              <button 
                type="submit"
                disabled={isSearching}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-bold transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSearching ? '検索中...' : '検索'}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map((song) => (
                  <div key={song.id} className="group flex items-center justify-between p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-transparent hover:border-orange-200 transition-all">
                    <div>
                      <h3 className="font-bold text-gray-800">{song.title}</h3>
                      <p className="text-sm text-gray-500">{song.artist} • <span className="italic">{song.genre}</span></p>
                    </div>
                    <button 
                      onClick={() => castVote(song)}
                      className="bg-white text-orange-500 border-2 border-orange-400 hover:bg-orange-500 hover:text-white px-4 py-1 rounded-full text-sm font-bold transition-colors flex items-center gap-1"
                    >
                      <span>👍</span> 投票
                    </button>
                  </div>
                ))
              ) : !isSearching && searchQuery && (
                <p className="text-center text-gray-400 py-8">候補が見つかりませんでした。</p>
              )}
            </div>
          </section>

          {/* Detailed Ranking List */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <span>🏆</span> ランキング詳細
            </h2>
            <div className="space-y-2">
              {sortedRanking.length > 0 ? (
                sortedRanking.map((record, index) => (
                  <div key={record.song.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-white ${
                      index === 0 ? 'bg-yellow-400' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-800">{record.song.title}</div>
                      <div className="text-xs text-gray-500">{record.song.artist}</div>
                    </div>
                    <div className="text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full text-sm">
                      {record.votes} 票
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-4">まだランキングがありません。</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Visualization */}
        <div className="space-y-6">
          <section className="sticky top-6">
            <h2 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
              <span>📊</span> 人気状況 (Top 10)
            </h2>
            <RankingChart data={Object.values(votes) as VoteRecord[]} />
            
            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h3 className="font-bold text-blue-700 mb-2">💡 お知らせ</h3>
              <p className="text-sm text-blue-600 leading-relaxed">
                投票が重複した場合は自動的にカウントが加算されます。放送してほしい曲にどんどん「投票」ボタンを押しましょう！
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Success Modal */}
      {showModal && lastVoted && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div className="text-sm font-bold">
              「{lastVoted.title}」に投票しました！
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Hint for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t p-4 flex justify-around text-xs text-gray-500">
        <div className="flex flex-col items-center gap-1 opacity-50">
            <span className="text-xl">🏠</span> Home
        </div>
        <div className="flex flex-col items-center gap-1 text-orange-500">
            <span className="text-xl">🔍</span> Request
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
            <span className="text-xl">📊</span> Stats
        </div>
      </div>
    </div>
  );
};

export default App;
