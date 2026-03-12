import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const bucket = process.env.R2_BUCKET_NAME!;

export async function uploadImage(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function listObjects(prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const res = await r2.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );
    for (const obj of res.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key);
    }
    continuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (continuationToken);

  return keys;
}

export async function deleteObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  // S3 DeleteObjects supports max 1000 keys per request
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000);
    await r2.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: batch.map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  }
}
