<?php
/**
 * @var string $page_title
 * @var int $course_id
 * @var array $menu_list
 */
?>
<div class="wrap coursepress-wrap coursepress-edit">
	<h1 class="wp-heading-inline">
		<?php if ( ! empty( $course_id ) ) : ?>
			<span class="course-title-tag"><?php _e( 'Course Name', 'cp' ); ?></span>
		<?php endif; ?>

		<?php echo $page_title; ?>
	</h1>

	<div id="course-edit-template" class="coursepress-page">
		<div class="step-list course-menu-list">
            <span class="cp-icon cp-icon-md step-icon-bars"><i class="fa fa-bars"></i></span>
			<ul class="course-menu">
				<?php foreach ( $menu_list as $key => $label ) : ?>
					<li class="step" data-step="<?php echo $key; ?>">
						<span class="menu-label"><?php echo $label; ?></span>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
		<div class="step-contents course-content">
			<?php  foreach ( $menu_list as $key => $label ) : ?>
				<div id="<?php echo $key; ?>" class="content-tab"></div>
			<?php endforeach; ?>

			<div class="course-footer">
				<button type="button" class="cp-btn cp-btn-default step-back">
					<?php _e( 'Back', 'cp' ); ?>
				</button>
				<button type="button" class="cp-btn cp-right cp-btn-active step-next">
					<?php _e( 'Save and Continue', 'cp' ); ?>
				</button>
                <button type="button" class="cp-btn cp-right cp-btn-cancel step-cancel">
					<?php _e( 'Cancel', 'cp' ); ?>
                </button>
			</div>
		</div>
	</div>
</div>