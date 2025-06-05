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
