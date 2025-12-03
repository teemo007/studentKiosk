import iosStep1 from "../assets/images/printing/ios-step1-wifi.png";
import iosStep2 from "../assets/images/printing/ios-step2-share.jpg";
import iosStep3 from "../assets/images/printing/ios-step3-printer.png";
import iosStep4 from "../assets/images/printing/ios-step4-release.jpg";
import androidStep1 from "../assets/images/printing/android-step1-wifi.png";
import androidStep2 from "../assets/images/printing/android-step2-wifi.png";
import androidStep3 from "../assets/images/printing/android-step3-wifi.png";
import androidStep4 from "../assets/images/printing/android-step4-wifi.png";
import androidStep5 from "../assets/images/printing/android-step5-wifi.png";
import androidStep6 from "../assets/images/printing/android-step6-wifi.png";

export const printingSetUp = {
  ios: `
    <div class="printing-guide">
      <h2>Wireless Printing – iPhone / iPad</h2>

      <p class="printing-intro">
        Follow the pictures to print from your phone.
      </p>

      <div class="printing-step-large">
        <div class="printing-step-number">1</div>
        <div class="printing-step-image-large">
          <img
            src="${iosStep1}"
            alt="Connect to Baruch WiFi on iPhone"
          />
        </div>
        <div class="printing-step-title-large">
          Connect to <strong>Baruch WiFi</strong>
        </div>
        <div class="printing-step-sub-large">
          Make sure you’re on campus WiFi.
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">2</div>
        <div class="printing-step-image-large">
          <img
            src="${iosStep2}"
            alt="Share and Print from iPhone"
          />
        </div>
        <div class="printing-step-title-large">
          Open file → <strong>Share</strong> → <strong>Print</strong>
        </div>
        <div class="printing-step-sub-large">
          Pick the photo/document, then choose Print.
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">3</div>
        <div class="printing-step-image-large">
          <img
            src="${iosStep3}"
            alt="Choose Baruch printer on iPhone"
          />
        </div>
        <div class="printing-step-title-large">
          Choose a <strong>Baruch printer</strong>
        </div>
        <div class="printing-step-sub-large">
          Select NVC 2FL / 3FL B&amp;W or NVC Color, then tap Print.
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">4</div>
        <div class="printing-step-image-large">
          <img
            src="${iosStep4}"
            alt="Release print job at station"
          />
        </div>
        <div class="printing-step-title-large">
          Release at the <strong>print station</strong>
        </div>
        <div class="printing-step-sub-large">
          Log in at the release station and tap Release.
        </div>
      </div>

      <div class="printing-extra">
       
      </div>
    </div>
  `,

  android: `
    <div class="printing-guide">
      <h2>Wireless Printing – Android Phone</h2>

      <p class="printing-intro">
        Follow these pictures to print from Android.
      </p>

      <div class="printing-step-large">
        <div class="printing-step-number">1</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep1}"
            alt="Connect to Baruch WiFi on Android"
          />
        </div>
        <div class="printing-step-title-large">
          Connect to <strong>Baruch WiFi</strong>
        </div>
        <div class="printing-step-sub-large">
          Make sure your phone is on the campus WiFi.
        </div>
        <div class="printing-step-sub-large">
          Make sure mobile print is "On".Then select "Mobile Print" to view the printer available.
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">2</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep2}"
            alt="open microsoft word or similar application from Android"
          />
        </div>
        <div class="printing-step-title-large">
          Open "Microsoft Word".
        </div>
        <div class="printing-step-sub-large">
          Or any similar applications.
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">3</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep3}"
            alt="select print on MicroSoft Word"
          />
        </div>
        <div class="printing-step-title-large">
          Just open up the app and select <strong>"Print"</strong> from
          the menu after retrieving your document.
        </div>
        <div class="printing-step-sub-large">
          
        </div>
      </div>

      <div class="printing-step-large">
        <div class="printing-step-number">4</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep4}"
            alt="select printers"
          />
        </div>
        <div class="printing-step-title-large">
          Select the down arrow to choose your printer
        </div>
        <div class="printing-step-sub-large">
          You can select <strong>"BaruchBW" </strong> or <strong>"BaruchColor"</strong>.
        </div>
      </div>
      <div class="printing-step-large">
        <div class="printing-step-number">4</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep5}"
            alt="select paper size"
          />
        </div>
        <div class="printing-step-title-large">
          Select the down arrow to choose your Paper size.
        </div>
        <div class="printing-step-sub-large">
          Also make sure that paper size selected is <strong>"Letter Size"</strong>.
        </div>
      </div>
      <div class="printing-step-large">
        <div class="printing-step-number">4</div>
        <div class="printing-step-image-large">
          <img
            src="${androidStep6}"
            alt="Release print job at station"
          />
        </div>
        <div class="printing-step-title-large">
          Release at the <strong>print station</strong>
        </div>
        <div class="printing-step-sub-large">
          Log in at the release station and release your job.
        </div>
      </div>

      <div class="printing-extra">
        
      </div>
    </div>
  `,
};
