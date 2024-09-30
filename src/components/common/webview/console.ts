/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
export const INJECT_DEBUG = `
{
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.log = function() {
    var message = JSON.stringify(Array.from(arguments));
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "LOG", data: { method: "log", args: message } })
    );
    originalConsoleLog.apply(console, arguments);
  };

  console.error = function() {
    var message = JSON.stringify(Array.from(arguments));
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "LOG", data: { method: "error", args: message } })
    );
    originalConsoleError.apply(console, arguments);
  };

  console.warn = function() {
    var message = JSON.stringify(Array.from(arguments));
    window.ReactNativeWebView?.postMessage(
      JSON.stringify({ type: "LOG", data: { method: "warn", args: message } })
    );
    originalConsoleWarn.apply(console, arguments);
  };
};
`
export type LogType = 'log' | 'error' | 'warn'

export const handleLog = ({ method, args }: { method: string; args: string }) => {
  const parsedArgs = JSON.parse(args)
  const logMessage = `[WebView] ${parsedArgs.join(' ')}`

  switch (method) {
    case 'log':
      console.log(logMessage)
      break
    case 'error':
      console.error(logMessage)
      break
    case 'warn':
      console.warn(logMessage)
      break
    default:
      console.log(logMessage)
  }
}
