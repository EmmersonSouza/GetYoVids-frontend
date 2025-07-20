// Monetization Service for handling direct links and pop-unders
interface MonetizationConfig {
  regularUrl: string;
  adultUrl: string;
  regularPopUnderScript: string;
  adultPopUnderScript: string;
  regularPopUnderHtml: string;
  adultPopUnderHtml: string;
}

const DEFAULT_CONFIG: MonetizationConfig = {
  regularUrl: 'https://www.profitableratecpm.com/ez1aaw8g?key=51edc43e9af4ba16487654d5ad13b998',
  adultUrl: 'https://www.profitableratecpm.com/dbr0v40ree?key=0e82932f1f8aea216d88b58a4d024b63',
  regularPopUnderScript: '//pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.js',
  adultPopUnderScript: '//pl27204234.profitableratecpm.com/a2/a2/85/a2a28507a6bd2463e79401e2b296cb2c.js',
  regularPopUnderHtml: 'https://pl27204121.profitableratecpm.com/d0/57/c2/d057c2967ef81828dc840400a9c2c6e6.html',
  adultPopUnderHtml: 'https://pl27204234.profitableratecpm.com/a2/a2/85/a2a28507a6bd2463e79401e2b296cb2c.html'
};

export type PlatformType = 'adult' | 'regular';

class MonetizationService {
  private config: MonetizationConfig;

  constructor(config: Partial<MonetizationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Execute monetization for a given platform type
   * This ensures both direct link AND pop-under are triggered
   */
  async executeMonetization(platformType: PlatformType): Promise<void> {
    console.log(`💰 Executing monetization for ${platformType} platform`);

    try {
      // Execute all monetization methods simultaneously
      await Promise.all([
        this.openDirectLink(platformType),
        this.executePopUnderScript(platformType),
        this.executePopUnderIframe(platformType),
        this.executePopUnderWindow(platformType)
      ]);

      console.log('✅ All monetization methods executed successfully');
    } catch (error) {
      console.error('❌ Monetization execution failed:', error);
    }
  }

  /**
   * Method 1: Open direct link in new tab
   */
  private async openDirectLink(platformType: PlatformType): Promise<void> {
    const url = platformType === 'adult' ? this.config.adultUrl : this.config.regularUrl;
    
    try {
      const newTab = window.open(url, '_blank');
      if (newTab) {
        console.log('✅ Direct link opened in new tab');
      } else {
        console.warn('⚠️ Direct link blocked by popup blocker');
      }
    } catch (error) {
      console.warn('⚠️ Direct link failed:', error);
    }
  }

  /**
   * Method 2: Execute pop-under script
   */
  private async executePopUnderScript(platformType: PlatformType): Promise<void> {
    return new Promise((resolve) => {
      const scriptUrl = platformType === 'adult' 
        ? this.config.adultPopUnderScript 
        : this.config.regularPopUnderScript;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = scriptUrl;
      
      script.onload = () => {
        console.log('✅ Pop-under script loaded and executed');
        resolve();
      };
      
      script.onerror = () => {
        console.warn('⚠️ Pop-under script failed to load');
        resolve();
      };

      // Add to head to trigger execution
      document.head.appendChild(script);
      
      // Fallback: resolve after timeout if script doesn't load
      setTimeout(resolve, 2000);
    });
  }

  /**
   * Method 3: Execute pop-under via iframe
   */
  private async executePopUnderIframe(platformType: PlatformType): Promise<void> {
    return new Promise((resolve) => {
      try {
        const iframeUrl = platformType === 'adult' 
          ? this.config.adultPopUnderHtml 
          : this.config.regularPopUnderHtml;

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        iframe.src = iframeUrl;
        
        iframe.onload = () => {
          console.log('✅ Pop-under iframe loaded');
          // Remove iframe after a delay
          setTimeout(() => {
            if (document.body.contains(iframe)) {
              document.body.removeChild(iframe);
            }
          }, 3000);
          resolve();
        };
        
        iframe.onerror = () => {
          console.warn('⚠️ Pop-under iframe failed');
          resolve();
        };

        document.body.appendChild(iframe);
        
        // Fallback: resolve after timeout
        setTimeout(resolve, 2000);
      } catch (error) {
        console.warn('⚠️ Pop-under iframe method failed:', error);
        resolve();
      }
    });
  }

  /**
   * Method 4: Execute pop-under via window.open with specific features
   */
  private async executePopUnderWindow(platformType: PlatformType): Promise<void> {
    return new Promise((resolve) => {
      try {
        const url = platformType === 'adult' ? this.config.adultUrl : this.config.regularUrl;
        
        // Use specific window features to create pop-under effect
        const features = 'width=1,height=1,left=-9999,top=-9999,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no';
        
        const popUnder = window.open(url, '_blank', features);
        
        if (popUnder) {
          console.log('✅ Pop-under window created');
          // Focus back to main window
          window.focus();
          
          // Close pop-under after a delay
          setTimeout(() => {
            try {
              popUnder.close();
            } catch (error) {
              // Ignore errors when closing
            }
          }, 2000);
        } else {
          console.warn('⚠️ Pop-under window blocked');
        }
        
        resolve();
      } catch (error) {
        console.warn('⚠️ Pop-under window method failed:', error);
        resolve();
      }
    });
  }

  /**
   * Execute monetization with retry logic
   */
  async executeWithRetry(platformType: PlatformType, maxRetries: number = 2): Promise<void> {
    let attempts = 0;
    
    while (attempts < maxRetries) {
      try {
        await this.executeMonetization(platformType);
        return; // Success, exit
      } catch (error) {
        attempts++;
        console.warn(`⚠️ Monetization attempt ${attempts} failed, retrying...`, error);
        
        if (attempts < maxRetries) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    console.error(`❌ Monetization failed after ${maxRetries} attempts`);
  }
}

// Export singleton instance
export const monetizationService = new MonetizationService();

// Export for testing
export { MonetizationService }; 