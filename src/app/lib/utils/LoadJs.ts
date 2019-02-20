export function LoadJs(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let script, doc;

      doc = window.document;
      script = doc.createElement("script");
      doc.querySelector("head").appendChild(script);

      // 加载完成
      script.onload = () => {
        resolve();
      };

      // 加载失败
      script.onerror = () => {
        reject();
      };

      // 开始加载
      script.src = url;
    });
}

