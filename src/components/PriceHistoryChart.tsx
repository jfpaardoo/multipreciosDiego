import { useMemo, useState } from 'react';

interface PriceHistoryChartProps {
    currentPrice: number;
    productId?: string;
}

// Simple seeded random generator to ensure consistent charts for the same product
class SeededRandom {
    private seed: number;
    constructor(seedStr: string) {
        let hash = 0;
        for (let i = 0; i < seedStr.length; i++) {
            const char = seedStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        this.seed = Math.abs(hash);
    }

    // Returns number between 0 and 1
    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
}

export function PriceHistoryChart({ currentPrice, productId = 'default' }: PriceHistoryChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const data = useMemo(() => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const currentMonthIndex = new Date().getMonth();
        const history = [];
        const rng = new SeededRandom(productId);
        
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonthIndex - i + 12) % 12;
            let price;
            if (i === 0) {
                price = currentPrice;
            } else {
                // Rigged logic: History is always higher than current
                // Use seeded random so it doesn't change on refresh
                const randomFactor = rng.next(); 
                const randomIncrease = (currentPrice * 0.05) + randomFactor * (currentPrice * 0.30);
                price = currentPrice + randomIncrease;
            }
            
            history.push({
                month: months[monthIndex],
                price: price
            });
        }
        return history;
    }, [currentPrice, productId]);

    // Calculate dimensions with more breathing room
    const prices = data.map(d => d.price);
    const minData = Math.min(...prices);
    const maxData = Math.max(...prices);
    // Add 30% padding to top and bottom to avoid "squashed" look
    const padding = (maxData - minData) * 0.3; 
    // Ensure min isn't negative
    const minY = Math.max(0, minData - padding); 
    const maxY = maxData + padding;
    const range = maxY - minY;

    const getX = (index: number) => (index / (data.length - 1)) * 100;
    const getY = (price: number) => 100 - ((price - minY) / range) * 100;

    // Generate points for the line
    const points = data.map((d, i) => ({ x: getX(i), y: getY(d.price) }));

    // Improved smooth path generator (Cubic Bezier)
    const getSmoothPath = (points: {x: number, y: number}[]) => {
        if (points.length === 0) return '';
        
        const getControlPoint = (current: any, previous: any, next: any, reverse?: boolean) => {
            const p = previous || current;
            const n = next || current;
            // Reduced smoothing factor to avoid overshooting
            const smoothing = 0.15; 
            const o = {
                x: n.x - p.x,
                y: n.y - p.y
            };
            const angle = Math.atan2(o.y, o.x) + (reverse ? Math.PI : 0);
            const length = Math.sqrt(Math.pow(o.x, 2) + Math.pow(o.y, 2)) * smoothing;
            return {
                x: current.x + Math.cos(angle) * length,
                y: current.y + Math.sin(angle) * length
            };
        };

        return points.reduce((acc, point, i, a) => {
            if (i === 0) return `M ${point.x},${point.y}`;
            const cps = getControlPoint(a[i - 1], a[i - 2], point);
            const cpe = getControlPoint(point, a[i - 1], a[i + 1], true);
            return `${acc} C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
        }, '');
    };

    const linePath = getSmoothPath(points);
    const areaPath = `${linePath} L 100,100 L 0,100 Z`;

    // Generate Y-axis labels (5 steps)
    const yLabels = [];
    for (let i = 0; i <= 4; i++) {
        const value = minY + (range * (i / 4));
        yLabels.push(value);
    }

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Historial de Precios</h3>
                        <p className="text-sm text-gray-500">Evolución últimos 6 meses</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{currentPrice.toFixed(2)}€</div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            PRECIO MÍNIMO
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="p-6 pl-2">
                <div className="flex h-80">
                    {/* Y-Axis Labels */}
                    <div className="flex flex-col justify-between text-xs font-medium text-gray-400 pr-4 text-right w-12 select-none">
                        {yLabels.reverse().map((label, i) => (
                            <span key={i}>{label.toFixed(0)}€</span>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 relative">
                        {/* Horizontal Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            {yLabels.map((_, i) => (
                                <div key={i} className="border-t border-gray-100 w-full h-0 dashed" />
                            ))}
                        </div>

                        {/* SVG Chart */}
                        <div className="absolute inset-0">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.2"/>
                                    </filter>
                                </defs>

                                {/* Area Fill */}
                                <path d={areaPath} fill="url(#chartGradient)" />

                                {/* Main Line */}
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    vectorEffect="non-scaling-stroke"
                                    filter="url(#shadow)"
                                />
                            </svg>
                        </div>

                        {/* HTML Overlay for Points and Tooltips */}
                        <div className="absolute inset-0">
                            {data.map((d, i) => (
                                <div
                                    key={i}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group z-10"
                                    style={{ left: `${getX(i)}%`, top: `${getY(d.price)}%` }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {/* Hit area */}
                                    <div className="w-10 h-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                    
                                    {/* Visible Dot */}
                                    <div 
                                        className={`w-3.5 h-3.5 rounded-full border-[3px] shadow-sm transition-all duration-200 ${
                                            i === data.length - 1 
                                                ? 'bg-green-500 border-white ring-2 ring-green-500 scale-110' 
                                                : 'bg-white border-blue-500 group-hover:scale-125 group-hover:border-blue-600'
                                        }`}
                                    />

                                    {/* Tooltip */}
                                    <div 
                                        className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 transition-all duration-200 z-50 ${
                                            hoveredIndex === i ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                                        }`}
                                    >
                                        <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl flex flex-col items-center min-w-[80px] whitespace-nowrap">
                                            <span className="font-bold text-sm">{d.price.toFixed(2)}€</span>
                                            <span className="text-gray-400 text-[10px] uppercase tracking-wider">{d.month}</span>
                                        </div>
                                        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900 mx-auto"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* X-Axis Labels */}
                <div className="flex justify-between mt-2 pl-12 text-xs font-medium text-gray-400">
                    {data.map((d, i) => (
                        <span key={i} className="w-8 text-center">{d.month}</span>
                    ))}
                </div>
            </div>
            
            <div className="bg-green-50/80 p-4 text-center border-t border-green-100 backdrop-blur-sm">
                 <p className="text-sm text-green-800 font-medium">
                    ¡Ahorras un <span className="font-bold text-lg">{((maxData - currentPrice) / maxData * 100).toFixed(0)}%</span> respecto al precio máximo reciente!
                </p>
            </div>
        </div>
    );
}
