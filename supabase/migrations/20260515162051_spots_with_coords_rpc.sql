-- RPC: list_spots
-- Returns all sustainable_spots joined with category info,
-- extracting lat/lng from the geography column.
create or replace function list_spots()
returns table (
  id           uuid,
  category_id  uuid,
  name_ja      text,
  name_en      text,
  description_ja text,
  description_en text,
  lat          double precision,
  lng          double precision,
  address_ja   text,
  address_en   text,
  tags         text[],
  category_slug text,
  category_icon text
)
language sql
stable
set search_path = public
as $$
  select
    s.id,
    s.category_id,
    s.name_ja,
    s.name_en,
    s.description_ja,
    s.description_en,
    st_y(s.location::geometry) as lat,
    st_x(s.location::geometry) as lng,
    s.address_ja,
    s.address_en,
    s.tags,
    c.slug  as category_slug,
    c.icon  as category_icon
  from sustainable_spots s
  join categories c on c.id = s.category_id
  order by s.name_en;
$$;
