/**
 * YatraSetu — submissions.js
 * Use-my-location, char counter, client-side form validation.
 */

(function () {
  'use strict';

  var form          = document.getElementById('submit-form');
  var locationBtn   = document.getElementById('use-location-btn');
  var locationStatus= document.getElementById('location-status');
  var latInput      = document.getElementById('spot-lat');
  var lngInput      = document.getElementById('spot-lng');
  var reasonInput   = document.getElementById('spot-reason');
  var reasonCount   = document.getElementById('reason-count');
  var errorDiv      = document.getElementById('submit-error');
  var submitBtn     = document.getElementById('submit-btn');

  if (!form) return;

  /* ── Character counter ─────────────────────────────────────────── */
  if (reasonInput && reasonCount) {
    reasonInput.addEventListener('input', function () {
      reasonCount.textContent = this.value.length;
    });
  }

  /* ── Use my location ───────────────────────────────────────────── */
  if (locationBtn) {
    locationBtn.addEventListener('click', function () {
      if (!navigator.geolocation) {
        if (locationStatus) locationStatus.textContent = 'Geolocation not supported.';
        return;
      }

      if (locationStatus) locationStatus.textContent = 'Acquiring…';
      locationBtn.disabled = true;

      navigator.geolocation.getCurrentPosition(
        function (pos) {
          if (latInput) latInput.value = pos.coords.latitude.toFixed(6);
          if (lngInput) lngInput.value = pos.coords.longitude.toFixed(6);
          if (locationStatus) locationStatus.textContent = '✓ Location filled';
          locationBtn.disabled = false;
        },
        function () {
          if (locationStatus) locationStatus.textContent = 'Permission denied.';
          locationBtn.disabled = false;
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  /* ── Spot Photo Upload & Preview ───────────────────────────────── */
  var dropzone       = document.getElementById('photo-dropzone');
  var fileInput      = document.getElementById('spot-image-file');
  var dropzonePrompt = document.getElementById('dropzone-prompt');
  var previewCard    = document.getElementById('photo-preview-card');
  var previewImg     = document.getElementById('preview-img');
  var previewFilename= document.getElementById('preview-filename');
  var previewFilesize= document.getElementById('preview-filesize');
  var changePhotoBtn = document.getElementById('change-photo-btn');
  var removePhotoBtn = document.getElementById('remove-photo-btn');
  var toggleUrlBtn   = document.getElementById('toggle-url-btn');
  var urlContainer   = document.getElementById('url-input-container');
  var urlInput       = document.getElementById('spot-image');

  var MAX_SIZE_MB = 10;

  function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function handleFile(file) {
    hideError();
    if (!file) return;

    var ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
    var isImage = file.type ? file.type.startsWith('image/') : ['jpg','jpeg','png','webp','gif'].indexOf(ext) !== -1;

    if (!isImage) {
      showError('Please upload an image file (JPG, PNG, WEBP, or GIF).');
      clearFile();
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showError('Photo is too large (' + formatBytes(file.size) + '). Maximum allowed size is ' + MAX_SIZE_MB + 'MB.');
      clearFile();
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
      if (previewImg) previewImg.src = e.target.result;
      if (previewFilename) previewFilename.textContent = file.name;
      if (previewFilesize) previewFilesize.textContent = formatBytes(file.size);
      if (dropzonePrompt) dropzonePrompt.style.display = 'none';
      if (previewCard) previewCard.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }

  function clearFile() {
    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewCard) previewCard.style.display = 'none';
    if (dropzonePrompt) dropzonePrompt.style.display = 'flex';
  }

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', function (e) {
      if (e.target.closest('#remove-photo-btn') || e.target.closest('#change-photo-btn')) {
        return;
      }
      if (!fileInput.files || fileInput.files.length === 0) {
        fileInput.click();
      }
    });

    dropzone.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && (!fileInput.files || fileInput.files.length === 0)) {
        e.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener('change', function () {
      if (this.files && this.files[0]) {
        handleFile(this.files[0]);
      }
    });

    if (changePhotoBtn) {
      changePhotoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (removePhotoBtn) {
      removePhotoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        clearFile();
      });
    }

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].forEach(function (eventName) {
      dropzone.addEventListener(eventName, function (e) {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });

    dropzone.addEventListener('drop', function (e) {
      var dt = e.dataTransfer;
      if (dt && dt.files && dt.files[0]) {
        fileInput.files = dt.files;
        handleFile(dt.files[0]);
      }
    });
  }

  if (toggleUrlBtn && urlContainer) {
    toggleUrlBtn.addEventListener('click', function () {
      if (urlContainer.style.display === 'none' || !urlContainer.style.display) {
        urlContainer.style.display = 'block';
        toggleUrlBtn.textContent = '▲ Hide web link field';
        if (urlInput) urlInput.focus();
      } else {
        urlContainer.style.display = 'none';
        toggleUrlBtn.textContent = '🔗 Or enter an image web link instead';
      }
    });
  }

  /* ── Client-side validation ────────────────────────────────────── */
  if (form) {
    form.addEventListener('submit', function (e) {
      hideError();

      var spotName = document.getElementById('spot-name');
      var category = document.getElementById('spot-category');
      var lat      = latInput  ? parseFloat(latInput.value)  : NaN;
      var lng      = lngInput  ? parseFloat(lngInput.value)  : NaN;

      if (spotName && !spotName.value.trim()) {
        showError('Please enter a name for the spot.');
        spotName.focus();
        e.preventDefault();
        return;
      }

      if (category && !category.value) {
        showError('Please select a category.');
        category.focus();
        e.preventDefault();
        return;
      }

      if (isNaN(lat) || lat < -90 || lat > 90) {
        showError('Please enter a valid latitude (between -90 and 90).');
        if (latInput) latInput.focus();
        e.preventDefault();
        return;
      }

      if (isNaN(lng) || lng < -180 || lng > 180) {
        showError('Please enter a valid longitude (between -180 and 180).');
        if (lngInput) lngInput.focus();
        e.preventDefault();
        return;
      }

      /* All good — let the form submit naturally (server handles it) */
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting…';
      }
    });
  }

  function showError(msg) {
    if (!errorDiv) return;
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideError() {
    if (errorDiv) errorDiv.style.display = 'none';
  }

})();
