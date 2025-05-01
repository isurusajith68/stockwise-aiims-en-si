// src/lib/ai/notificationService.ts
export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission();
  }

  return Notification.permission === "granted";
}

export function sendNotification(
  title: string,
  message: string,
  icon?: string
) {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return false;
  }

  const notification = new Notification(title, {
    body: message,
    icon: icon || "/logo.png",
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return true;
}

// Usage example in AIAssistant component:
// import { requestNotificationPermission, sendNotification } from '../lib/ai/notificationService';
//
// useEffect(() => {
//   // Request permission on component mount
//   requestNotificationPermission();
//
//   // Check for critical issues and notify
//   const criticalItems = generateInventoryRecommendations(products, sales).criticalItems;
//   if (criticalItems && criticalItems.length > 0) {
//     criticalItems.forEach(item => {
//       sendNotification(
//         t('notifications.criticalStock'),
//         item.recommendation
//       );
//     });
//   }
// }, [products, sales]);
