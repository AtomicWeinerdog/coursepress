<?php
$user = coursepress_get_user();
$enrolled_courses = $user->get_user_enrolled_at();
$statuses = array(
	'ongoing' => __( 'On Going', 'cp' ),
	'failed' => __( 'Failed', 'cp' ),
	'incomplete' => __( 'Incomplete', 'cp' ),
	'completed' => __( 'Completed', 'cp' ),
	'pass' => __( 'Certified', 'cp' ),
);
$pagenow = remove_query_arg( 'dummy', add_query_arg( 'dummy', 1 ) );
?>

<?php if ( ! empty( $enrolled_courses ) ) { ?>
	<h3><?php esc_html_e( 'My Courses', 'cp' ); ?></h3>
	<table class="coursepress-table courses-table">
		<thead>
		<th><?php esc_html_e( 'Course', 'cp' ); ?></th>
		<th><?php esc_html_e( 'Progress', 'cp' ); ?></th>
		<th colspan="2"><?php esc_html_e( 'Status', 'cp' ); ?></th>
		</thead>
		<tbody>
		<?php foreach ( $enrolled_courses as $course ) : ?>
			<tr>
				<td>
					<a href="<?php echo esc_url( $course->get_permalink() ); ?>" rel="bookmark"><?php echo esc_html( $course->post_title ); ?></a>
				</td>
				<td>
					<?php echo esc_html( $user->get_course_progress( $course->ID ) ); ?>%
				</td>
				<td>
					<?php
					$completion_status = $user->get_course_completion_status( $course->ID );
					echo esc_html( $statuses[ $completion_status ] );
					?>
				</td>
				<td align="right">
					<div class="coursepress-dropdown">
						<label for="coursepress-dropdown-input-<?php echo esc_attr( $course->ID ); ?>">
							<span class="screen-reader-text"><?php esc_html_e( 'Menu', 'cp' ); ?></span>
							<i class="fa fa-bars"></i>
						</label>
						<input type="checkbox" autocomplete="off" id="coursepress-dropdown-input-<?php echo esc_attr( $course->ID ); ?>" />
						<ul class="coursepress-dropdown-menu">
							<li>
								<a href="<?php echo esc_url( $course->get_workbook_url() ); ?>"><?php esc_html_e( 'Workbook', 'cp' ); ?></a>
							</li>
							<li>
								<a href="<?php echo esc_url( $course->get_unenroll_url( $pagenow ) ); ?>"><?php esc_html_e( 'Withdraw', 'cp' ); ?></a>
							</li>
						</ul>
					</div>
				</td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
<?php
} else {
	$url = coursepress_get_student_login_url();
	$message = sprintf( __( 'To see student dashbord you need to be <a href="%s">logged in</a>.', 'cp' ), $url );
	if ( is_user_logged_in() ) {
		$courses_link = coursepress_get_main_courses_url();
		$courses_link = sprintf( '<a href="%1$s" rel="bookmark">%2$s</a>', esc_url( $courses_link ), __( 'Courses', 'cp' ) );
		$message = sprintf( __( 'You are not enrolled to any course. Go to %s and enroll now!', 'cp' ), $courses_link );
	}
	printf( '<p class="description">%s</p>', esc_html( $message ) );
}
