<?php
/**
 * Server render for the Resource Cards block.
 *
 * Renders the live set of cherry_resource posts, so the grid iterates over the
 * Member Resources managed in wp-admin. Cards link to the resource URL;
 * member-only resources route through the post permalink, where the existing
 * gating filter enforces sign-in.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Saved inner content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 *
 * @package CherrystoneBlocks
 */

$eyebrow   = isset( $attributes['eyebrow'] ) ? $attributes['eyebrow'] : '';
$heading   = isset( $attributes['heading'] ) ? $attributes['heading'] : '';
$lede      = isset( $attributes['lede'] ) ? $attributes['lede'] : '';
$warm      = ! empty( $attributes['warm'] );
$max_items = isset( $attributes['maxItems'] ) ? (int) $attributes['maxItems'] : 0;
$tag       = isset( $attributes['tagFilter'] ) ? trim( $attributes['tagFilter'] ) : '';
$collapse  = isset( $attributes['collapseAfter'] ) ? (int) $attributes['collapseAfter'] : 0;

$query_args = array(
	'post_type'      => 'cherry_resource',
	'post_status'    => 'publish',
	'posts_per_page' => $max_items > 0 ? $max_items : -1,
	'orderby'        => 'date',
	'order'          => 'ASC',
);

if ( '' !== $tag ) {
	$query_args['meta_query'] = array(
		array(
			'key'   => 'cs_resource_type',
			'value' => $tag,
		),
	);
}

$resources = get_posts( $query_args );
$member_portal_authenticated = function_exists( 'cherrystone_blocks_member_portal_is_authenticated' ) && cherrystone_blocks_member_portal_is_authenticated();

$wrapper_attributes = get_block_wrapper_attributes(
	array( 'class' => 'block' . ( $warm ? ' warm' : '' ) )
);
?>
<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped by get_block_wrapper_attributes(). ?>>
	<div class="container">
		<div class="block-head">
			<div>
				<?php if ( '' !== $eyebrow ) : ?>
					<span class="eyebrow accent"><?php echo wp_kses_post( $eyebrow ); ?></span>
				<?php endif; ?>
				<?php if ( '' !== $heading ) : ?>
					<h2 style="margin-top:24px;"><?php echo wp_kses_post( $heading ); ?></h2>
				<?php endif; ?>
			</div>
			<?php if ( '' !== $lede ) : ?>
				<p class="lede"><?php echo wp_kses_post( $lede ); ?></p>
			<?php endif; ?>
		</div>

		<?php
		$tags = array();
		foreach ( $resources as $resource ) {
			$audience = get_post_meta( $resource->ID, 'cs_resource_type', true );
			if ( $audience && ! in_array( $audience, $tags, true ) ) {
				$tags[] = $audience;
			}
		}
		// Sort tags to ensure a consistent, beautiful order: Investors -> Entrepreneurs -> Additional -> Member News
		$preferred_order = array( 'Investors', 'Entrepreneurs', 'Additional', 'Member News' );
		usort( $tags, function( $a, $b ) use ( $preferred_order ) {
			$pos_a = array_search( $a, $preferred_order, true );
			$pos_b = array_search( $b, $preferred_order, true );
			$pos_a = false !== $pos_a ? $pos_a : 999;
			$pos_b = false !== $pos_b ? $pos_b : 999;
			return $pos_a - $pos_b;
		} );
		?>

		<?php if ( ! empty( $tags ) ) : ?>
			<div class="portfolio-controls resource-tabs" style="margin-bottom: 32px; display: flex; gap: 12px; flex-wrap: wrap;">
				<button class="chip active" data-filter="all"><?php esc_html_e( 'All', 'cherrystone-blocks' ); ?></button>
				<?php foreach ( $tags as $tag_name ) : ?>
					<?php
					$filter_val = strtolower( str_replace( ' ', '-', $tag_name ) );
					?>
					<button class="chip" data-filter="<?php echo esc_attr( $filter_val ); ?>"><?php echo esc_html( $tag_name ); ?></button>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>

		<div class="value-grid"<?php echo $collapse > 0 ? ' data-collapse-after="' . esc_attr( $collapse ) . '"' : ''; ?>>
			<?php foreach ( $resources as $resource ) : ?>
				<?php
				$audience    = get_post_meta( $resource->ID, 'cs_resource_type', true );
				$source      = get_post_meta( $resource->ID, 'cs_source', true );
				$url         = get_post_meta( $resource->ID, 'cs_resource_url', true );
				$member_only = '1' === get_post_meta( $resource->ID, 'cs_member_only', true );

				if ( $member_only && ! is_user_logged_in() && ! $member_portal_authenticated ) {
					$href     = get_permalink( $resource );
					$external = false;
				} elseif ( $url ) {
					$href     = $url;
					$external = true;
				} else {
					$href     = get_permalink( $resource );
					$external = false;
				}
				$tag_slug = $audience ? strtolower( str_replace( ' ', '-', $audience ) ) : '';
				?>
				<a
					class="value-card"
					data-tag="<?php echo esc_attr( $tag_slug ); ?>"
					href="<?php echo esc_url( $href ); ?>"
					<?php echo $external ? 'target="_blank" rel="noopener noreferrer"' : ''; ?>
					style="text-decoration:none;color:inherit;"
				>
					<?php if ( $audience ) : ?>
						<span class="num"><?php echo esc_html( $audience ); ?></span>
					<?php endif; ?>
					<h3><?php echo esc_html( get_the_title( $resource ) ); ?></h3>
					<?php if ( $source ) : ?>
						<p><?php echo esc_html( $source ); ?></p>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
