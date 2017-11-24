  <?php
  /*####################################
  ########## GENERAL SETTINGS #########
  #####################################*/
  add_theme_support('post-thumbnails');
  //svg fix
  function cc_mime_types($mimes) {
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
  }
  add_filter('upload_mimes', 'cc_mime_types');

  /*##################################
  ########## THEME OPTIONS ##########
  ###################################*/

  //+++++ Display Form-Inputs +++++
  function add_theme_menu_item()
  {
  	add_theme_page("Theme Config", "Theme Config", "manage_options", "theme-config", "theme_settings_page", null, 99);
  }

  add_action("admin_menu", "add_theme_menu_item");

  function theme_settings_page()
  {
      ?>
  	    <div class="wrap">
  	    <h1>Theme Config</h1>
        <p>This page provides a wide range of different options to customize kaleidoscope.</p>
  	    <form method="post" action="options.php" enctype="multipart/form-data">
  	        <?php
  	            settings_fields("general");
  	            do_settings_sections("theme-options");
  	            submit_button();
  	        ?>
  	    </form>
  		</div>
  	<?php
  }
  function display_password_element()
  {
  	?>
      	<input type="text" name="portfolio_kiosk_password" id="portfolio_kiosk_password" value="<?php echo get_option('portfolio_kiosk_password'); ?>" />
      <?php
  }
  function display_feedbackurl_element()
  {
  	?>
      	<input type="text" name="portfolio_feedback_url" id="portfolio_feedback_url" size="150" value="<?php echo get_option('portfolio_feedback_url'); ?>" />
      <?php
  }
  function display_pagetitle_element()
  {
      ?>
          <input type="text" name="portfolio_pagetitle" id="portfolio_pagetitle" size="150" value="<?php echo get_option('portfolio_pagetitle'); ?>" />
      <?php
  }
  function display_analytic_element()
  {
  	?>
      	<textarea name="portfolio_analytic" class="large-text" cols="50" rows="10"  id="portfolio_analytic"><?php echo get_option('portfolio_analytic'); ?></textarea>
      <?php
  }

  function display_caption_element()
  {
  	?>
      	<textarea name="detail_captions" class="large-text" cols="50" rows="10"  id="detail_captions"><?php echo get_option('detail_captions'); ?></textarea>
      <?php
  }
  function display_lockEnabled_element()
  {
  	?>
      	<input type="text" name="lockEnabled" id="lockEnabled" value="<?php echo get_option('lockEnabled'); ?>" />
      <?php
  }
  function display_showFilterTags_element()
  {
    ?>
        <input type="text" name="showFilterTags" id="showFilterTags" value="<?php echo get_option('showFilterTags'); ?>" />
      <?php
  }
  function display_lockTimeInSeconds_element()
  {
  	?>
      	<input type="text" name="lockTimeInSeconds" id="lockTimeInSeconds" value="<?php echo get_option('lockTimeInSeconds'); ?>" />
      <?php
  }
  function display_overviewTimerMax_element()
  {
    ?>
        <input type="text" name="overviewTimerMax" id="overviewTimerMax" value="<?php echo get_option('overviewTimerMax'); ?>" />
      <?php
  }
  function display_updatedTimeInDays_element()
  {
      ?>
          <input type="text" name="updatedTimeInDays" id="updatedTimeInDays" value="<?php echo get_option('updatedTimeInDays'); ?>" />
      <?php
  }
  function display_showCredit_element()
  {
  	?>
      	<input type="text" name="enableCredit" id="enableCredit" value="<?php echo get_option('enableCredit'); ?>" />
      <?php
  }
  function logo_display()
  {
  	?>
  	    <input type="file" id="portfolio_logo" name="portfolio_logo" />
        <img src="<?php echo htmlspecialchars(get_option('portfolio_logo'), ENT_QUOTES, 'UTF-8'); ?>" height="200" width="200">
        <?php echo htmlspecialchars(get_option('portfolio_logo'), ENT_QUOTES, 'UTF-8'); ?>
     <?php
  }
  function logo_align_right()
  {
    ?>
        <input type="text" name="portfolio_logo_right" id="portfolio_logo_right" value="<?php echo get_option('portfolio_logo_right'); ?>" />
      <?php
  }
  function default_kiosk_mode()
  {
    ?>
        <input type="text" name="portfolio_default_kiosk_mode" id="portfolio_default_kiosk_mode" value="<?php echo get_option('portfolio_default_kiosk_mode'); ?>" />
      <?php
  }
  function screensaver_display()
  {
  	?>
   	      <input type="file" id="screensaver_image" name="screensaver_image" />
          <img src="<?php echo htmlspecialchars(get_option('screensaver_image'), ENT_QUOTES, 'UTF-8'); ?>" width="200">
          <?php echo htmlspecialchars(get_option('screensaver_image'), ENT_QUOTES, 'UTF-8'); ?>
       <?php
  }
  function display_mainFilters_element()
  {
  	?>
      	<textarea name="main_filters" class="large-text" cols="50" rows="10"  id="main_filters"><?php echo get_option('main_filters'); ?></textarea>
      <?php
  }
  function display_overviewConfig_element()
  {
    ?>
        <textarea name="overview_config" class="large-text" cols="50" rows="10"  id="overview_config"><?php echo get_option('overview_config'); ?></textarea>
      <?php
  }
  function display_matrixFilters_element()
  {
   	?>
       	<textarea name="matrix_filters" class="large-text" cols="50" rows="10"  id="matrix_filters"><?php echo get_option('matrix_filters'); ?></textarea>
    <?php
  }
  function display_matrix_filters_excluded_x()
  {
   	?>
       	<textarea name="matrix_filters_excluded_x" class="large-text" cols="50" rows="10"  id="matrix_filters_excluded_x"><?php echo get_option('matrix_filters_excluded_x'); ?></textarea>
    <?php
  }
  function display_matrix_filters_excluded_y()
  {
   	?>
       	<textarea name="matrix_filters_excluded_y" class="large-text" cols="50" rows="10"  id="matrix_filters_excluded_y"><?php echo get_option('matrix_filters_excluded_y'); ?></textarea>
    <?php
  }

  function display_factSheetItems_element()
  {
      ?>
          <textarea name="portfolio_factSheetItems" class="large-text" cols="50" rows="10"  id="portfolio_factSheetItems"><?php echo get_option('portfolio_factSheetItems'); ?></textarea>
      <?php
  }
  function display_factSheetItemsLocked_element()
  {
  	?>
      	<textarea name="portfolio_factSheetItemsLocked" class="large-text" cols="50" rows="10"  id="portfolio_factSheetItemsLocked"><?php echo get_option('portfolio_factSheetItemsLocked'); ?></textarea>
      <?php
  }
  function display_screensaverImages_element()
  {
      ?>
          <textarea name="portfolio_screensaverImages" class="large-text" cols="50" rows="10"  id="portfolio_screensaverImages"><?php echo get_option('portfolio_screensaverImages'); ?></textarea>
      <?php
  }
  function display_searchString_element()
  {
      ?>
          <textarea name="portfolio_searchString" class="large-text" cols="50" rows="10"  id="portfolio_searchString"><?php echo get_option('portfolio_searchString'); ?></textarea>
      <?php
  }
  function display_searchStringLocked_element()
  {
      ?>
          <textarea name="portfolio_searchStringLocked" class="large-text" cols="50" rows="10"  id="portfolio_searchStringLocked"><?php echo get_option('portfolio_searchStringLocked'); ?></textarea>
      <?php
  }
  function display_coloredByElement_element()
  {
      ?>
          <input type="text" name="portfolio_coloredByElement" id="portfolio_coloredByElement" value="<?php echo get_option('portfolio_coloredByElement'); ?>" />
      <?php
  }
  function display_showEditButton_element()
  {
      ?>
          <input type="text" name="portfolio_showEditButton" id="portfolio_showEditButton" value="<?php echo get_option('portfolio_showEditButton'); ?>" />
      <?php
  }
  function display_showCopyLinkButton_element()
  {
      ?>
          <input type="text" name="portfolio_showCopyLinkButton" id="portfolio_showCopyLinkButton" value="<?php echo get_option('portfolio_showCopyLinkButton'); ?>" />
      <?php
  }
  function display_showSearchButton_element()
  {
      ?>
          <input type="text" name="portfolio_showSearchButton" id="portfolio_showSearchButton" value="<?php echo get_option('portfolio_showSearchButton'); ?>" />
      <?php
  }
  function display_showMatrixButton_element()
  {
      ?>
          <input type="text" name="portfolio_showMatrixButton" id="portfolio_showMatrixButton" value="<?php echo get_option('portfolio_showMatrixButton'); ?>" />
      <?php
  }
  function display_matrix_xaxis()
    {
        ?>
            <input type="text" name="portfolio_matrix_xaxis" id="portfolio_matrix_xaxis" value="<?php echo get_option('portfolio_matrix_xaxis'); ?>" />
        <?php
    }
  function display_matrix_yaxis()
      {
          ?>
              <input type="text" name="portfolio_matrix_yaxis" id="portfolio_matrix_yaxis" value="<?php echo get_option('portfolio_matrix_yaxis'); ?>" />
          <?php
      }
 function display_matrix_show_fontsize_dimension()
       {
           ?>
               <input type="text" name="portfolio_matrix_show_fontsize_dimension" id="portfolio_matrix_show_fontsize_dimension" value="<?php echo get_option('portfolio_matrix_show_fontsize_dimension'); ?>" />
           <?php
        }
  function display_matrix_fontsize_dimension()
        {
            ?>
                <input type="text" name="portfolio_matrix_fontsize_dimension" id="portfolio_matrix_fontsize_dimension" value="<?php echo get_option('portfolio_matrix_fontsize_dimension'); ?>" />
            <?php
        }
  function display_background_image()
      {
          ?>
              <input type="text" name="portfolio_backgroundImage" id="portfolio_backgroundImage" value="<?php echo get_option('portfolio_backgroundImage'); ?>" />
          <?php
      }
  function display_showFeedbackButton_element()
  {
      ?>
          <input type="text" name="portfolio_showFeedbackButton" id="portfolio_showFeedbackButton" value="<?php echo get_option('portfolio_showFeedbackButton'); ?>" />
      <?php
  }
  function display_enableImgLightbox_element(){
    ?>
        <input type="text" name="portfolio_enableImgLightbox" id="portfolio_enableImgLightbox" value="<?php echo get_option('portfolio_enableImgLightbox'); ?>" />
    <?php
  }
  function display_detailViewSections_element()
  {
      ?>
          <textarea name="portfolio_detailViewSections" class="large-text" cols="50" rows="10"  id="portfolio_detailViewSections"><?php echo get_option('portfolio_detailViewSections'); ?></textarea>
      <?php
  }
  function display_detailViewShowCube_element()
  {
      ?>
          <input type="text" name="portfolio_detailViewShowCube" id="portfolio_detailViewShowCube" value="<?php echo get_option('portfolio_detailViewShowCube'); ?>" />
      <?php
  }
  function display_showSapLogo_element()
  {
      ?>
          <input type="text" name="portfolio_showSapLogo" id="portfolio_showSapLogo" value="<?php echo get_option('portfolio_showSapLogo'); ?>" />
      <?php
  }
  function display_filterRule_element()
  {
      ?>
          <input type="text" name="portfolio_filterRule" id="portfolio_filterRule" value="<?php echo get_option('portfolio_filterRule'); ?>" />
      <?php
  }
  function display_filterButtonCaption_element()
  {
      ?>
          <input type="text" name="portfolio_filterButtonCaption" id="portfolio_filterButtonCaption" value="<?php echo get_option('portfolio_filterButtonCaption'); ?>" />
      <?php
  }
  function display_idleScroll_element()
  {
      ?>
          <input type="text" name="idleScrollEnabled" id="idleScrollEnabled" value="<?php echo get_option('idleScrollEnabled'); ?>" />
      <?php
  }
  function display_enableMailToLink()
  {
        ?>
            <input type="text" name="portfolio_enableMailToLink" id="portfolio_enableMailToLink" value="<?php echo get_option('portfolio_enableMailToLink'); ?>" />
        <?php
  }
  function display_showContactFunction_element()
  {
    ?>
        <input type="text" name="portfolio_showContactFunction" id="portfolio_showContactFunction" value="<?php echo get_option('portfolio_showContactFunction'); ?>" />
    <?php
  }
  function display_showPDFOverlay()
  {
      ?>
          <input type="text" name="portfolio_showPDFOverlay" id="portfolio_showPDFOverlay" value="<?php echo get_option('portfolio_showPDFOverlay'); ?>" />
      <?php
  }
  function display_lockSidebar()
  {
    ?>
        <input type="text" name="portfolio_lockSidebar" id="portfolio_lockSidebar" value="<?php echo get_option('portfolio_lockSidebar'); ?>" />
    <?php
  }
  function display_filterAsRadioButtons()
  {
    ?>
        <input type="text" name="portfolio_filterAsRadioButtons" id="portfolio_filterAsRadioButtons" value="<?php echo get_option('portfolio_filterAsRadioButtons'); ?>" />
    <?php
  }
  function handle_logo_upload()
  {
  	if(!empty($_FILES["portfolio_logo"]["tmp_name"]))
  	{
  		$urls = wp_handle_upload($_FILES["portfolio_logo"], array('test_form' => FALSE));
  		if ($urls["error"])
  		{
  			return $urls["error"];
  		}
  	    $temp = $urls["url"];
  	    return $temp;
  	}
  	return get_option('portfolio_logo');
  }

  function handle_screensaver_upload()
  {
   	if(!empty($_FILES["screensaver_image"]["tmp_name"]))
   	{
   		$urls = wp_handle_upload($_FILES["screensaver_image"], array('test_form' => FALSE));
   		if ($urls["error"])
   		{
   			return $urls["error"];
   		}
   	    $temp = $urls["url"];
   	    return $temp;
   	}
   	return get_option('screensaver_image');
  }

  function display_theme_panel_fields()
  {
    //+++++ Initialize Setting-Sections +++++
    add_settings_section("general", "General Settings", null, "theme-options");
    add_settings_section("matrix", "Settings for Matrix-View", null, "theme-options");
    add_settings_section("project", "Settings for Project-Detail-View", null, "theme-options");

    //+++++ Initialize Settings +++++
    //General
    add_settings_field("portfolio_pagetitle", "Title of page", "display_pagetitle_element", "theme-options", "general");
    add_settings_field("portfolio_logo", "Logo", "logo_display", "theme-options", "general");
    add_settings_field("portfolio_logo_right", "Logo Align Right", "logo_align_right", "theme-options", "general");
    add_settings_field("portfolio_default_kiosk_mode", "Set per default in kiosk mode?", "default_kiosk_mode", "theme-options", "general");
  	add_settings_field("portfolio_kiosk_password", "Password (for changeing operation mode)", "display_password_element", "theme-options", "general");
  	add_settings_field("portfolio_feedback_url", "URL (for mail-feedback.php)", "display_feedbackurl_element", "theme-options", "general");
    add_settings_field("portfolio_analytic", "Analytic-Code-Snippet", "display_analytic_element", "theme-options", "general");
    add_settings_field("detail_captions", "Shortcut translation", "display_caption_element", "theme-options", "general");
    add_settings_field("main_filters", "Main filters", "display_mainFilters_element", "theme-options", "general");
    add_settings_field("overview_config", "Overview Configuration", "display_overviewConfig_element", "theme-options", "general");
    add_settings_field("portfolio_searchString", "Allowed Items in Search", "display_searchString_element", "theme-options", "general");
    add_settings_field("portfolio_searchStringLocked", "Allowed Items in Search (Kiosk-Mode)", "display_searchStringLocked_element", "theme-options", "general");
    add_settings_field("portfolio_coloredByElement", "Filter for colour discrimination", "display_coloredByElement_element", "theme-options", "general");
    add_settings_field("portfolio_showEditButton", "Show Edit Button", "display_showEditButton_element", "theme-options", "general");
    add_settings_field("portfolio_showCopyLinkButton", "Show CopyLink Button", "display_showCopyLinkButton_element", "theme-options", "general");
    add_settings_field("portfolio_showSearchButton", "Show Search Button", "display_showSearchButton_element", "theme-options", "general");
    add_settings_field("portfolio_showFeedbackButton", "Show Feedback Button", "display_showFeedbackButton_element", "theme-options", "general");
    add_settings_field("portfolio_backgroundImage", "Enable Background Image", "display_background_image", "theme-options", "general");
    add_settings_field("portfolio_lockSidebar", "Lock sidebar open", "display_lockSidebar", "theme-options", "general");
    add_settings_field("portfolio_filterAsRadioButtons", "Filter behave like radio buttons", "display_filterAsRadioButtons", "theme-options", "general");
    add_settings_field("lockEnabled", "Enable Operation-Mode switch button.", "display_lockEnabled_element", "theme-options", "general");
    add_settings_field("lockTimeInSeconds", "Timeout sidebar opened", "display_lockTimeInSeconds_element", "theme-options", "general");
    add_settings_field("overviewTimerMax", "Overview Timeout (minutes)", "display_overviewTimerMax_element", "theme-options", "general");
    add_settings_field("updatedTimeInDays", "Updated Tag shown within number of days", "display_updatedTimeInDays_element", "theme-options", "general");
    add_settings_field("enableCredit", "Enable ICN Credit", "display_showCredit_element", "theme-options", "general");
    add_settings_field("portfolio_showSapLogo", "Enable SAP Logo", "display_showSapLogo_element", "theme-options", "general");
    add_settings_field("portfolio_filterRule", "Filter rule ('AND'/'OR')", "display_filterRule_element", "theme-options", "general");
    add_settings_field("portfolio_filterButtonCaption", "Filter Button Caption", "display_filterButtonCaption_element", "theme-options", "general");
    add_settings_field("showFilterTags", "Show Filter Tags", "display_showFilterTags_element", "theme-options", "general");

    add_settings_field("idleScrollEnabled", "Enable Idle-Scrolling", "display_idleScroll_element", "theme-options", "general");
    add_settings_field("portfolio_enableMailToLink", "Enable 'emailable' Contacts", "display_enableMailToLink", "theme-options", "general");
    add_settings_field("portfolio_screensaverImages", "Screensaver Images", "display_screensaverImages_element", "theme-options", "general");
    //Matrix-View
    add_settings_field("portfolio_showMatrixButton", "Show Matrix Button", "display_showMatrixButton_element", "theme-options", "matrix");
    add_settings_field("matrix_filters", "Filters", "display_matrixFilters_element", "theme-options", "matrix");
    add_settings_field("matrix_filters_excluded_x", "Excluded Filters xAxis", "display_matrix_filters_excluded_x", "theme-options", "matrix");
    add_settings_field("matrix_filters_excluded_y", "Excluded Filters yAxis", "display_matrix_filters_excluded_y", "theme-options", "matrix");
    add_settings_field("portfolio_matrix_xaxis", "Default filter xAxis", "display_matrix_xaxis", "theme-options", "matrix");
    add_settings_field("portfolio_matrix_yaxis", "Default filter yAxis", "display_matrix_yaxis", "theme-options", "matrix");
    add_settings_field("portfolio_matrix_show_fontsize_dimension", "Enable filter zAxis (Font-Size)", "display_matrix_show_fontsize_dimension", "theme-options", "matrix");
    add_settings_field("portfolio_matrix_fontsize_dimension", "Default filter zAxis (Font-Size)", "display_matrix_fontsize_dimension", "theme-options", "matrix");
    //Project-Detail-View
    add_settings_field("portfolio_factSheetItems", "Factsheet Items", "display_factSheetItems_element", "theme-options", "project");
    add_settings_field("portfolio_factSheetItemsLocked", "Factsheet Items (Kiosk-Mode)", "display_factSheetItemsLocked_element", "theme-options", "project");
    add_settings_field("portfolio_detailViewSections", "Items in Detail-View", "display_detailViewSections_element", "theme-options", "project");
    add_settings_field("portfolio_detailViewShowCube", "Show Cube Icons in Content Sections?", "display_detailViewShowCube_element", "theme-options", "project");
    add_settings_field("portfolio_enableImgLightbox", "Enable LightBox for Gallery", "display_enableImgLightbox_element", "theme-options", "project");
    add_settings_field("portfolio_showContactFunction", "Show function of contacts", "display_showContactFunction_element", "theme-options", "project");
    add_settings_field("portfolio_showPDFOverlay", "Display Overlay on PDFs", "display_showPDFOverlay", "theme-options", "project");

    //+++++ Register Settings +++++
    //General
    register_setting("general", "portfolio_pagetitle");
    register_setting("general", "portfolio_logo", "handle_logo_upload");
    register_setting("general", "portfolio_logo_right");
    register_setting("general", "portfolio_showContactFunction");
    register_setting("general", "portfolio_kiosk_password");
    register_setting("general", "portfolio_analytic");
    register_setting("general", "portfolio_feedback_url");
    register_setting("general", "portfolio_analytic");
    register_setting("general", "detail_captions");
    register_setting("general", "main_filters");
    register_setting("general", "overview_config");
    register_setting("general", "portfolio_searchString");
    register_setting("general", "portfolio_searchStringLocked");
    register_setting("general", "portfolio_coloredByElement");
    register_setting("general", "portfolio_showEditButton");
    register_setting("general", "portfolio_showCopyLinkButton");
    register_setting("general", "portfolio_showSearchButton");
    register_setting("general", "portfolio_showFeedbackButton");
    register_setting("general", "portfolio_backgroundImage");
    register_setting("general", "portfolio_lockSidebar");
    register_setting("general", "portfolio_filterAsRadioButtons");
    register_setting("general", "lockEnabled");
    register_setting("general", "lockTimeInSeconds");
    register_setting("general", "overviewTimerMax");
    register_setting("general", "updatedTimeInDays");
    register_setting("general", "enableCredit");
    register_setting("general", "portfolio_showSapLogo");
    register_setting("general", "portfolio_filterRule");
    register_setting("general", "portfolio_filterButtonCaption");
    register_setting("general", "idleScrollEnabled");
    register_setting("general", "portfolio_enableMailToLink");
    register_setting("general", "portfolio_screensaverImages");
    register_setting("general", "showFilterTags");
    //Matrix-View
    register_setting("general", "portfolio_showMatrixButton");
    register_setting("general", "matrix_filters");
    register_setting("general", "matrix_filters_excluded_x");
    register_setting("general", "matrix_filters_excluded_y");
    register_setting("general", "portfolio_matrix_xaxis");
    register_setting("general", "portfolio_matrix_yaxis");
    register_setting("general", "enableCreportfolio_matrix_show_fontsize_dimensiondit");
    register_setting("general", "portfolio_matrix_fontsize_dimension");
    //Project-Detail-View
    register_setting("general", "portfolio_factSheetItems");
    register_setting("general", "portfolio_factSheetItemsLocked");
    register_setting("general", "portfolio_detailViewSections");
    register_setting("general", "portfolio_detailViewShowCube");
    register_setting("general", "portfolio_enableImgLightbox");
    register_setting("general", "portfolio_default_kiosk_mode");
    register_setting("general", "portfolio_showPDFOverlay");
  }

  add_action("admin_init", "display_theme_panel_fields");
  ?>
