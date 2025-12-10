import React, { useState } from 'react';
import ValveAnimation from './components/ValveAnimation';
import ChatAssistant from './components/ChatAssistant';
import { ValveMode, ValveFault } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<ValveMode>(ValveMode.COOLING);
  const [fault, setFault] = useState<ValveFault>('NONE');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
             </div>
             <h1 className="text-xl font-bold text-slate-800 tracking-tight">HVAC 实验室: 四通阀原理</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">交互式教学演示</div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Visualization & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Display Area */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
             <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${mode === ValveMode.COOLING ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {mode === ValveMode.COOLING ? '制冷模式' : '制热模式'}
                  </span>
                  {fault !== 'NONE' && (
                    <span className="px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-700 font-bold animate-pulse">
                      ⚠️ 故障模拟中: {fault === 'COIL_BURN' ? '线圈烧毁' : '阀体卡死'}
                    </span>
                  )}
                </h2>
                
                {/* Mode Toggle */}
                <div className="bg-slate-100 p-1 rounded-lg flex">
                  <button 
                    onClick={() => setMode(ValveMode.COOLING)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === ValveMode.COOLING ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    制冷
                  </button>
                  <button 
                    onClick={() => setMode(ValveMode.HEATING)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === ValveMode.HEATING ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    制热
                  </button>
                </div>
             </div>

             <ValveAnimation mode={mode} fault={fault} />
             
             {/* Controls for Fault Simulation */}
             <div className="mt-6 border-t border-slate-100 pt-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">故障模拟实验室 (Fault Lab)</p>
                <div className="flex flex-wrap gap-2">
                   <button 
                     onClick={() => setFault('NONE')}
                     className={`px-3 py-1.5 text-sm rounded-md border ${fault === 'NONE' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
                   >
                     正常运行
                   </button>
                   <button 
                     onClick={() => setFault('COIL_BURN')}
                     className={`px-3 py-1.5 text-sm rounded-md border ${fault === 'COIL_BURN' ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-orange-50'}`}
                   >
                     模拟: 线圈烧毁
                   </button>
                   <button 
                     onClick={() => setFault('VALVE_STUCK')}
                     className={`px-3 py-1.5 text-sm rounded-md border ${fault === 'VALVE_STUCK' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-300 hover:bg-red-50'}`}
                   >
                     模拟: 阀芯卡死
                   </button>
                </div>
             </div>
             
             <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h3 className="font-medium text-slate-900 mb-2">当前状态解析</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {fault === 'NONE' ? (
                     mode === ValveMode.COOLING 
                       ? '【正常】线圈断电。先导阀使主阀左侧卸压，D口高压推动滑块向右（图示位置），系统进行制冷循环。'
                       : '【正常】线圈通电产生磁场。先导阀使主阀右侧卸压，D口高压推动滑块向左，系统进行制热循环。'
                  ) : fault === 'COIL_BURN' ? (
                     <span className="text-orange-700">
                       【故障】虽然您选择了制热模式，但由于<strong>线圈烧毁</strong>，先导阀无法动作，滑块仍停留在默认的制冷位置。用户会感觉空调“只冷不热”。
                     </span>
                  ) : (
                     <span className="text-red-700">
                       【故障】滑块<strong>卡在中间</strong>位置（串气）。高压气体(D)直接泄露到低压回气口(S)。这会导致压缩机过热保护，且几乎没有制冷/制热效果。
                     </span>
                  )}
                </p>
             </div>
          </div>

          {/* Deep Dive: Mechanics */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              深度解析：先导阀换向原理
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p>
                四通阀的主滑块非常重，且处于高压环境中，仅靠电磁力无法直接推动它。因此，工程师设计了巧妙的<strong>“借力打力”</strong>机制：
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-blue-500">
                <li>
                  <strong className="text-slate-800">先导阀 (Pilot Valve):</strong> 主阀上方有一个很小的电磁阀。它的作用不是控制冷媒主路，而是控制主滑块两侧活塞腔的压力。
                </li>
                <li>
                  <strong className="text-slate-800">压差驱动 (Differential Pressure):</strong> 
                  当先导阀改变毛细管的通断时，会人为造成主滑块左右两侧的压力差。高压侧的气体就像一只无形的大手，将滑块猛烈地推向低压侧。
                </li>
                <li>
                  <strong className="text-slate-800">为什么缺氟导致不换向？</strong> 
                  如果系统冷媒泄漏，高低压差太小，这只“无形的大手”力气不够，就推不动滑块，导致四通阀无法换向。
                </li>
              </ul>
            </div>
          </div>

          {/* Troubleshooting: Failure Modes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              故障模式速查表
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 rounded-lg border transition-all cursor-pointer ${fault === 'VALVE_STUCK' ? 'bg-red-100 border-red-300 ring-2 ring-red-400' : 'bg-red-50 border-red-100 hover:bg-red-100'}`}
                onClick={() => setFault('VALVE_STUCK')}
              >
                <h4 className="font-bold text-red-800 mb-2">1. 阀体卡死 (Stuck)</h4>
                <p className="text-xs text-red-700 leading-relaxed">
                  <strong>现象：</strong> 压力异常，无法制冷或制热。敲击阀体有时能恢复。<br/>
                  <strong>点击此处模拟</strong>
                </p>
              </div>
              <div 
                className={`p-4 rounded-lg border transition-all cursor-pointer ${fault === 'COIL_BURN' ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-400' : 'bg-orange-50 border-orange-100 hover:bg-orange-100'}`}
                onClick={() => setFault('COIL_BURN')}
              >
                <h4 className="font-bold text-orange-800 mb-2">2. 线圈烧毁 (Coil Burnout)</h4>
                <p className="text-xs text-orange-700 leading-relaxed">
                  <strong>现象：</strong> 只能制冷，无法制热（断电默认制冷）。阻值无穷大。<br/>
                  <strong>点击此处模拟</strong>
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 opacity-60">
                <h4 className="font-bold text-yellow-800 mb-2">3. 内部串气 (Cross-flow)</h4>
                <p className="text-xs text-yellow-800 leading-relaxed">
                  <strong>现象：</strong> 压缩机发烫，高低压差小。阀芯密封不严导致。<br/>
                  (效果类似卡死)
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 opacity-60">
                <h4 className="font-bold text-slate-800 mb-2">4. 流量不足 (Low Flow)</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>现象：</strong> 换向声微弱。毛细管堵塞导致推力不足。
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: AI Assistant */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-24">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-slate-800">AI 专家助手</h2>
              <p className="text-slate-500 text-sm">可以问我：“如何检测电磁线圈好坏？” 或 “阀芯卡死怎么办？”</p>
            </div>
            <ChatAssistant />
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;