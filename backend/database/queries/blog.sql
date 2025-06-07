--! create
 INSERT INTO blogs (account_id, title, content)
 VALUES (:account_id, :title, :content)
 RETURNING id;

--! get
SELECT id, account_id, title, content
FROM blogs
WHERE id = :id;

--! get_all
SELECT id, account_id, title, content
FROM blogs
ORDER BY created_at DESC;

--! search_blog
SELECT id, account_id, title, content
FROM blogs
WHERE content LIKE '%' || :content || '%'
ORDER BY created_at;
--! update (title?, content?)
UPDATE blogs
SET title = COALESCE(:title, title),
    content = COALESCE(:content, content)
WHERE id = :id 
AND account_id = :account_id;

--! delete
DELETE FROM blogs
WHERE id = :id
AND account_id = :account_id;
