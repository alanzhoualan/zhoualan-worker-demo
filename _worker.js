export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 1. API Route
    if (url.pathname === "/api/info") {
      const info = {
        time: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
        ip: request.headers.get("cf-connecting-ip") || "Unknown",
        country: request.headers.get("cf-ipcountry") || "Unknown",
        colo: request.headers.get("cf-ray") || "Unknown",
        userAgent: request.headers.get("user-agent") || "Unknown"
      };
      return new Response(JSON.stringify(info), {
        headers: { 
          "content-type": "application/json; charset=utf-8",
          "access-control-allow-origin": "*"
        }
      });
    }

    // 2. Default Page Route
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个 Cloudflare Worker</title>
    <style>
        body {
            font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
            background: linear-gradient(135deg, #1e1b4b 0%, #18181b 100%);
            color: #f4f4f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }
        .container {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            padding: 2.5rem;
            border-radius: 20px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
            text-align: center;
            transition: all 0.3s ease;
        }
        .container:hover {
            transform: translateY(-5px);
            border-color: rgba(251, 191, 36, 0.3);
        }
        h1 {
            background: linear-gradient(to right, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
            font-size: 1.8rem;
        }
        p {
            color: #a1a1aa;
            margin-bottom: 1.5rem;
        }
        .data-box {
            text-align: left;
            background: rgba(0, 0, 0, 0.4);
            padding: 1.2rem;
            border-radius: 10px;
            font-family: 'Fira Code', monospace;
            font-size: 0.85rem;
            color: #34d399;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(52, 211, 153, 0.15);
            line-height: 1.6;
        }
        button {
            background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
            color: #18181b;
            border: none;
            padding: 0.8rem 2rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
            transition: all 0.2s ease;
        }
        button:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.5);
        }
        button:active {
            transform: scale(0.98);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Cloudflare Worker 部署成功！</h1>
        <p>这是一个运行在边缘网络的 Serverless 脚本。</p>
        <div class="data-box" id="info">正在获取边缘节点数据...</div>
        <button onclick="fetchInfo()">刷新边缘数据</button>
    </div>
    <script>
        async function fetchInfo() {
            const el = document.getElementById('info');
            el.innerText = '正在请求...';
            try {
                const res = await fetch('/api/info');
                const data = await res.json();
                el.innerHTML = '【服务器时间】: ' + data.time + '<br>' +
                             '【您的客户端 IP】: ' + data.ip + '<br>' +
                             '【您所在的地区】: ' + data.country + '<br>' +
                             '【边缘节点节点】: ' + data.colo;
            } catch(e) {
                el.innerText = '请求失败';
            }
        }
        fetchInfo();
    </script>
</body>
</html>`;
    return new Response(html, {
      headers: { "content-type": "text/html; charset=utf-8" }
    });
  }
};
