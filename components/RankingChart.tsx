
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { VoteRecord } from '../types';

interface RankingChartProps {
  data: VoteRecord[];
}

const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa'];

const RankingChart: React.FC<RankingChartProps> = ({ data }) => {
  const chartData = data
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 10)
    .map(item => ({
      name: item.song.title,
      votes: item.votes,
      artist: item.song.artist
    }));

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-200">
        まだ投票がありません。
      </div>
    );
  }

  return (
    <div className="h-80 w-full bg-white p-4 rounded-xl shadow-sm border border-orange-100">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            width={120} 
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <Tooltip 
            cursor={{ fill: '#fef3c7' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="votes" radius={[0, 4, 4, 0]} barSize={20}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RankingChart;
