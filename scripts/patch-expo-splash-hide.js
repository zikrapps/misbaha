#!/usr/bin/env node
/** Keep splash hide working with React Native New Architecture (local patch). */
const fs = require('fs');
const path = require('path');

const target = path.join(
  __dirname,
  '..',
  'node_modules',
  'expo-splash-screen',
  'ios',
  'SplashScreenManager.swift',
);

if (!fs.existsSync(target)) {
  process.exit(0);
}

const source = fs.readFileSync(target, 'utf8');
if (source.includes('clearLoadingView(from: rootView)')) {
  process.exit(0);
}

const updated = source.replace(
  `      if options.fade {
        UIView.transition(with: rootView, duration: duration, options: .transitionCrossDissolve) {
          self.loadingView?.isHidden = true
        } completion: { _ in
          self.loadingView?.removeFromSuperview()
          self.loadingView = nil
        }
      } else {
        loadingView?.isHidden = true
        loadingView?.removeFromSuperview()
        loadingView = nil
      }`,
  `      if options.fade {
        UIView.transition(with: rootView, duration: duration, options: .transitionCrossDissolve) {
          self.loadingView?.isHidden = true
        } completion: { _ in
          self.clearLoadingView(from: rootView)
        }
      } else {
        loadingView?.isHidden = true
        clearLoadingView(from: rootView)
      }`,
).replace(
  `  func removeObservers() {
    NotificationCenter.default.removeObserver(self, name: Notification.Name("RCTContentDidAppearNotification"), object: nil)
  }
}`,
  `  func removeObservers() {
    NotificationCenter.default.removeObserver(self, name: Notification.Name("RCTContentDidAppearNotification"), object: nil)
  }

  private func clearLoadingView(from rootView: UIView) {
#if RCT_NEW_ARCH_ENABLED
    if let hostView = rootView as? RCTSurfaceHostingProxyRootView {
      hostView.disableActivityIndicatorAutoHide(false)
      hostView.setValue(false, forKey: "isActivityIndicatorViewVisible")
      hostView.activityIndicatorViewFactory = nil
    }
#endif
    loadingView?.removeFromSuperview()
    loadingView = nil
  }
}`,
);

if (updated === source) {
  console.warn('patch-expo-splash-hide: expected pattern not found, skipping');
  process.exit(0);
}

fs.writeFileSync(target, updated);
console.log('patch-expo-splash-hide: applied New Architecture splash hide fix');
