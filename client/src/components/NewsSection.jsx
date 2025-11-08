import { useState, useEffect } from "react";
// Assuming these are imported from your project's components/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ExternalLink, Newspaper } from "lucide-react";

const mockNews = [
{
id: "1",
title: "Stock Market Hits New High Amid Economic Recovery",
description: "Major indices reach record levels as investor confidence grows with improving economic indicators.",
source: "Financial Times",
publishedAt: new Date().toISOString(),
url: "#",
},
{
id: "2",
title: "RBI Keeps Interest Rates Unchanged",
description: "Reserve Bank maintains status quo on policy rates, focusing on inflation management and growth support.",
source: "Economic Times",
publishedAt: new Date(Date.now() - 86400000).toISOString(),
url: "#",
},
{
id: "3",
title: "Gold Prices Surge on Global Uncertainty",
description: "Precious metals see increased demand as investors seek safe-haven assets amid market volatility.",
source: "Bloomberg",
publishedAt: new Date(Date.now() - 172800000).toISOString(),
url: "#",
},
{
id: "4",
title: "New Tax Benefits for Savings Accounts Announced",
description: "Government introduces additional deductions for long-term savings in approved investment schemes.",
source: "Mint",
publishedAt: new Date(Date.now() - 259200000).toISOString(),
url: "#",
},
];

export default function NewsSection() {
const [news, setNews] = useState([]);

useEffect(() => {
setNews(mockNews);
}, []);

const formatDate = (dateString) => {
const date = new Date(dateString);
const now = new Date();
const diffMs = now - date;
const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

if (diffHours < 24) {
return `${diffHours}h ago`;
}
const diffDays = Math.floor(diffHours / 24);
return `${diffDays}d ago`;
};

return (
    // 1. Apply glassmorphism card background and white text
<Card className="bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-xl">
<CardHeader>
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
                {/* 2. Use the pink accent color for the main icon */}
<Newspaper className="h-5 w-5 text-pink-400" />
<CardTitle className="text-lg text-white">Financial News</CardTitle>
</div>
            {/* 3. Update the Live Badge to use accent border and translucent background */}
<Badge 
                className="gap-1 bg-white/10 text-pink-400 border border-pink-400 hover:bg-white/20"
            >
<TrendingUp className="h-3 w-3" />
Live
</Badge>
</div>
        {/* 4. Update secondary text color for dark background */}
<p className="text-sm text-white/70">Stay updated with latest market insights</p>
</CardHeader>
<CardContent>
<div className="space-y-4">
{news.map((article) => (
<div 
key={article.id} 
                // 5. Update article container style for dark theme hover effect
className="p-4 rounded-lg border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
data-testid={`news-article-${article.id}`}
>
<div className="flex items-start justify-between gap-4">
<div className="flex-1 space-y-2">
<div className="flex items-center gap-2">
                        {/* 6. Update Source Badge for dark background */}
<Badge className="text-xs bg-white/20 text-white hover:bg-white/30">
{article.source}
</Badge>
                        {/* 7. Update timestamp color */}
<span className="text-xs text-white/50">
{formatDate(article.publishedAt)}
</span>
</div>
<h4 className="font-semibold text-sm leading-tight text-white">
{article.title}
</h4>
                        {/* 8. Update description text color */}
<p className="text-sm text-white/70 line-clamp-2">
{article.description}
</p>
</div>
                {/* 9. Update link icon color */}
<ExternalLink className="h-4 w-4 text-white/50 flex-shrink-0" />
</div>
</div>
))}
</div>
</CardContent>
</Card>
);
}