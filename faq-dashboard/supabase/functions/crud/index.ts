import { serve } from 'https://deno.land/x/supabase_edge@latest/mod.ts'
import { createClient } from 'https://deno.land/x/supabase_edge@latest/supabase.js'

// Inisialisasi Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE')
)

serve(async (req) => {
  const url = new URL(req.url)
  const path = url.pathname.split('/').filter(Boolean)

  if (req.method === 'GET' && path[0] === 'faqs') {
    // GET /faqs - ambil semua FAQ
    const { data, error } = await supabase.from('faq').select('*')
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { status: 200 })
  }

  if (req.method === 'POST' && path[0] === 'faqs') {
    // POST /faqs - buat FAQ baru
    const { question, answer } = await req.json()
    const { data, error } = await supabase
      .from('faq')
      .insert([{ question, answer }])
      .select()

    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { status: 201 })
  }

  if (req.method === 'PUT' && path[0] === 'faqs' && path[1]) {
    // PUT /faqs/{id} - update FAQ
    const { question, answer } = await req.json()
    const { data, error } = await supabase
      .from('faq')
      .update({ question, answer })
      .eq('id', path[1])
      .select()

    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify(data), { status: 200 })
  }

  if (req.method === 'DELETE' && path[0] === 'faqs' && path[1]) {
    // DELETE /faqs/{id} - hapus FAQ
    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', path[1])

    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify({ message: 'FAQ deleted' }), {
      status: 200,
    })
  }

  return new Response('Not Found', { status: 404 })
})
