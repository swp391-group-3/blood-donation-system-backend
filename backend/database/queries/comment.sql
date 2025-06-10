
--! create
INSERT INTO comments(blog_id, account_id, content)
VALUES(:blog_id, :account_id, :content)
RETURNING ID;


--! delete
DELETE FROM comments
WHERE
id = :id;


--! update(content?)
UPDATE comments
SET content = COALESCE(:content, content)
WHERE id = :id;