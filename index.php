<!DOCTYPE html>
<html lang="de">
    <head>
        <meta charset="utf-8">
        <title><?= get_option('portfolio_pagetitle') ?></title>
        <?php echo wp_site_icon();?>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen, print" />
        <style>
        @media (max-width: 1920px) {

            #feedbackButton {
                width: 35px !important
            }
        }
            #feedbackButton {
                position: fixed;
                z-index: 10;
                bottom: 10px;
                right: 17px;
                width: 2.2vw;
                height:auto;
            }

            .playpause {
                background: url('<?php echo get_template_directory_uri(); ?>/img/playbutton.png');
            }
            @font-face {
                font-family: 'Benton Sans';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Normal.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Normal.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Normal.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Normal.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Normal.svg#CreativeBlockBBBold') format('svg');
                font-weight: 400;
                font-style: normal;
            }
            @font-face {
                font-family: 'Benton Sans';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Book.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Book.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Book.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Book.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Book.svg#CreativeBlockBBBold') format('svg');
                font-weight: 500;
                font-style: normal;
            }
            @font-face {
                font-family: 'Benton Sans';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Bold.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Bold.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Bold.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Bold.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Bold.svg#CreativeBlockBBBold') format('svg');
                font-weight: 700;
                font-style: normal;
            }
            @font-face {
                font-family: 'Benton Sans';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Light.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Light.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Light.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Light.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/BentonSans-Light.svg#CreativeBlockBBBold') format('svg');
                font-weight: 300;
                font-style: normal;
            }
            @font-face {
                font-family: 'Geogrotesque';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-SemiBold.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-SemiBold.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-SemiBold.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-SemiBold.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-SemiBold.svg#CreativeBlockBBBold') format('svg');
                font-weight: 600;
                font-style: normal;
            }
            @font-face {
                font-family: 'Geogrotesque';
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-UltraLight.eot');
                src: url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-UltraLight.eot?#iefix') format('embedded-opentype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-UltraLight.woff') format('woff'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-UltraLight.ttf') format('truetype'),
                     url('<?php echo get_template_directory_uri(); ?>/fonts/Geogrotesque-UltraLight.svg#CreativeBlockBBBold') format('svg');
                font-weight: 100;
                font-style: normal;
            }
            @font-face {
                font-family: "slick";
                src: url("<?php echo get_template_directory_uri(); ?>/fonts/slick.eot");
                src: url("<?php echo get_template_directory_uri(); ?>/fonts/slick.eot?#iefix") format("embedded-opentype"),
                     url("<?php echo get_template_directory_uri(); ?>/fonts/slick.woff") format("woff"),
                     url("<?php echo get_template_directory_uri(); ?>/fonts/slick.ttf") format("truetype"),
                     url("<?php echo get_template_directory_uri(); ?>/fonts/slick.svg#slick") format("svg");
                font-weight: normal;
                font-style: normal;
            }
             @font-face {
                font-family: "arrows";
                src: url("<?php echo get_template_directory_uri(); ?>/fonts/arrows.woff") format("woff");
                font-weight: normal;
                font-style: normal;
            }
        </style>
        <?php echo get_option('portfolio_analytic'); ?>
    </head>
    <body>
        <script>
            window.icnThemePath = '<?php echo get_template_directory_uri(); ?>/';
            window.portfolioLogoPath = '<?php echo get_option('portfolio_logo'); ?>';
            window.portfolio_logo_right = <?= get_option('portfolio_logo_right') ?>;
            window.screensaverImagePath = '<?php echo get_option('screensaver_image'); ?>';
			window.portfolio_detailViewShowCube = <?php echo get_option('portfolio_detailViewShowCube', 'true'); ?>;
            window.portfolio_showSapLogo = <?php echo get_option('portfolio_showSapLogo', 'true'); ?>;
            window.portfolio_filter_rule = <?php echo get_option('portfolio_filterRule'); ?>;
            window.portfolio_filter_button_caption = '<?= get_option('portfolio_filterButtonCaption') ?>';
            window.portfolio_factSheetItems = <?php echo get_option('portfolio_factSheetItems'); ?>;
            window.portfolio_factSheetItemsLocked = <?php echo get_option('portfolio_factSheetItemsLocked'); ?>;
            window.portfolio_screensaverImages = Array().concat(<?php echo get_option('portfolio_screensaverImages'); ?>);
            window.portfolio_searchString = <?php echo get_option('portfolio_searchString'); ?>;
            window.portfolio_detailViewSections = <?php echo get_option('portfolio_detailViewSections'); ?>;
            window.portfolio_searchStringLocked = <?php echo get_option('portfolio_searchStringLocked'); ?>;
            window.portfolio_coloredByElement = '<?php echo get_option('portfolio_coloredByElement' , 'portfolio_area'); ?>';
            window.portfolio_showEditButton = <?php echo get_option('portfolio_showEditButton', 'false')?>;
            window.portfolio_showCopyLinkButton = <?php echo get_option('portfolio_showCopyLinkButton', 'true')?>;
            window.portfolio_showSearchButton = <?php echo get_option('portfolio_showSearchButton', 'false')?>;
            window.portfolio_showMatrixButton = <?php echo get_option('portfolio_showMatrixButton', 'false')?>;
            window.portfolio_matrix_xaxis = '<?php echo get_option('portfolio_matrix_xaxis', 'project_state')?>';
            window.portfolio_matrix_yaxis = '<?php echo get_option('portfolio_matrix_yaxis', 'location')?>';
            window.portfolio_matrix_fontsize_dimension = '<?php echo get_option('portfolio_matrix_fontsize_dimension', 'none')?>';
            window.portfolio_show_matrix_fontsize_dimension = <?php echo get_option('portfolio_matrix_show_fontsize_dimension', 'false')?>;
            window.portfolio_showFeedbackButton = <?php echo get_option('portfolio_showFeedbackButton', 'false')?>;
            window.portfolio_backgroundImage = '<?php echo get_option('portfolio_backgroundImage', 'false')?>';
            window.portfolio_enableImgLightbox = <?php echo get_option('portfolio_enableImgLightbox', 'false')?>;
            window.portfolio_filterAsRadioButtons = <?php echo get_option('portfolio_filterAsRadioButtons', 'false')?>;
            window.icnAllProjects = [];
            window.portfolio_enableMailToLink = <?php echo get_option('portfolio_enableMailToLink', 'false')?>;
            window.portfolio_fullscreen_button = <?php echo get_option('portfolio_matrix_show_fullscreen_button', 'false')?>;
            window.lockEnabled = <?php echo get_option('lockEnabled', 'false')?>;
            window.showFilterTags = <?php echo get_option('showFilterTags', 'false')?>;
            window.showCredit = <?php echo get_option('enableCredit', 'false')?>;
            window.feedbackUrl = '<?= get_option('portfolio_feedback_url') ?>';
            window.lockTimeInSeconds = <?php echo get_option('lockTimeInSeconds', '0')?>;
            window.updatedTimeInDays = <?php echo get_option('updatedTimeInDays', '10')?>;
            window.detailCaptions = <?php echo get_option('detail_captions', '[]')?>;
            window.portfolio_kiosk_password = '<?= get_option('portfolio_kiosk_password') ?>';
            window.mainFilters = <?php echo get_option('main_filters', '[]')?>;
            window.matrix_filters_excluded_x = <?php echo get_option('matrix_filters_excluded_x', '[]')?>;
            window.matrix_filters_excluded_y = <?php echo get_option('matrix_filters_excluded_y', '[]')?>;
            window.matrixFilters = <?php echo get_option('matrix_filters', '[]')?>;
            window.idleScrollEnabled = <?php echo get_option('idleScrollEnabled', 'true'); ?>;
            window.portfolio_showContactFunction = <?php echo get_option('portfolio_showContactFunction', 'true')?>;
            window.portfolio_lockSidebar = <?php echo get_option('portfolio_lockSidebar', 'false')?>;
            window.portfolio_showPDFOverlay = <?php echo get_option('portfolio_showPDFOverlay', 'false')?>;
            window.temporarilyDisableTracking = false;
            window.lastPiwikAction = "";
            try {
                if(localStorage.getItem('justSwitchedLock')) {
                    localStorage.setItem('justSwitchedLock', false);
                } else {
                    localStorage.setItem('locked', <?php echo get_option('portfolio_default_kiosk_mode', 'false')?>);
                }
            } catch (e) {
                window.alert("Local Storage not supported. This might have several reasons. Please make sure you are not running Safari in private mode.");
            }
            if ((window.portfolio_filter_rule != "AND") && (window.portfolio_filter_rule != "OR")){
              window.portfolio_filter_rule = "AND";
            }

            <?php
                if(is_preview() ) {
                    $postsArr = array();
                    array_push($postsArr, get_post( get_the_ID() ) );
                } else {
                    $args = array(
                        'posts_per_page'   => 1000,
                        'offset'           => 0,
                        'orderby'          => 'date',
                        'order'            => 'DESC',
                        'post_type'        => 'portfolio',
                        'post_status'      => array('publish', 'private'),
                        'suppress_filters' => true
                    );
                    $postsArr = get_posts( $args );
                }
            ?>

            <?php for ($x = 0; $x < count($postsArr); $x++) : ?>
                <?php
                    $post = $postsArr[$x];
                    // ignore the cubo theme category
                    if (get_the_title($post->ID) == "Portfolio") { continue; }
                    $custom_fields = get_post_custom($post->ID);
                       ?>
                window.icnAllProjects.push({
                    title:              "<?php echo $post->post_title; ?>",
                    slug:               "<?php echo $post->post_name; ?>",
                    date:               "<?= $post->post_modified; ?>",
                    tags:               '<?php echo json_encode(wp_get_post_tags($post->ID)); ?>',
                    imageUrl:           "<?php the_post_thumbnail_url('full', $post->ID); ?>",
                    editLink:           "<?php echo get_edit_post_link( $post->ID ); ?>",
                    <?php
                    foreach (get_post_meta($post->ID) as $key => $value) {
                           if ($key[0] != "_") {
                    if ($value == NULL) {
                        $value = array();
                    }
                     //$formattedValue=json_encode(maybe_unserialize($value[0]));
                     $formattedValue= json_encode(get_field($key, $post->ID));
                            echo "\"$key\" : $formattedValue,\n";
                        }
                    }

                    ?>
                    visibility: "<?php if ( get_post_status($post->ID) == 'private' ){echo 'private';} else {echo 'public';} ?>"
                });
            <?php endfor; ?>
        </script>

        <div id="icnPortfolio" role="main"></div>
        <script type="text/javascript" src="<?php echo get_template_directory_uri(); ?>/bundle.js"></script>
        <script type="text/javascript">
            if(navigator.userAgent.match(/MSIE [1-9]\./)){
                var msg = document.createElement("p");
                msg.appendChild(document.createTextNode("Unfortunately, Internet Explorer versions 9 and older are not supported."));
                var main = document.getElementById("icnPortfolio");
                main.appendChild(msg);
            }
        </script>
    </body>
</html>
