const supabase = require('../config/supabaseClient');

const createJournal = async (req, res) => {
  const { title, content } = req.body;
  let imageUrl = null;

  try {
    // Handle file upload if present
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${req.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `journals/${fileName}`;

      // Upload to Supabase Storage with proper content type
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('journal-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
          cacheControl: '3600' // 1 hour cache
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw new Error(uploadError.message || 'Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journal-images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to generate public URL for uploaded image');
      }

      imageUrl = publicUrl;
    }

    // Create journal entry
    const { data: journal, error } = await supabase
      .from('journals')
      .insert([{ 
        user_id: req.user.id, 
        title, 
        content, 
        image_url: imageUrl 
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(journal);
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: error.message || 'Server error',
      details: error.details || null
    });
  }
};

const getJournals = async (req, res) => {
  try {
    const { data: journals, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(journals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJournal = async (req, res) => {
  const { id } = req.params;
  const { title, content, currentImageUrl } = req.body;
  let imageUrl = currentImageUrl || null;

  try {
    // Handle new file upload if present
    if (req.file) {
      // Delete old image if exists
      if (imageUrl) {
        try {
          const oldFileName = imageUrl.split('/').pop();
          const oldFilePath = `journals/${oldFileName}`;
          
          const { error: deleteError } = await supabase.storage
            .from('journal-images')
            .remove([oldFilePath]);

          if (deleteError) console.error('Failed to delete old image:', deleteError);
        } catch (deleteErr) {
          console.error('Error deleting old image:', deleteErr);
        }
      }

      // Upload new image
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${req.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `journals/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('journal-images')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journal-images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    } else if (currentImageUrl === '') {
      // Handle image removal case
      if (imageUrl) {
        try {
          const oldFileName = imageUrl.split('/').pop();
          const oldFilePath = `journals/${oldFileName}`;
          
          const { error: deleteError } = await supabase.storage
            .from('journal-images')
            .remove([oldFilePath]);

          if (deleteError) console.error('Failed to delete old image:', deleteError);
        } catch (deleteErr) {
          console.error('Error deleting old image:', deleteErr);
        }
      }
      imageUrl = null;
    }

    // Update journal entry
    const { data: journal, error } = await supabase
      .from('journals')
      .update({ 
        title: req.body.title || title,
        content: req.body.content || content,
        image_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(journal);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message || 'Server error',
      details: error.details || null
    });
  }
};

const deleteJournal = async (req, res) => {
  const { id } = req.params;

  try {
    // Get journal to delete image if exists
    const { data: journal, error: journalError } = await supabase
      .from('journals')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (journalError) throw journalError;

    // Delete image if exists
    if (journal.image_url) {
      const filePath = journal.image_url.split('/').slice(-2).join('/');
      await supabase.storage
        .from('journal-images')
        .remove([filePath]);
    }

    // Delete journal
    const { error } = await supabase
      .from('journals')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({ message: 'Journal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJournal,
  getJournals,
  updateJournal,
  deleteJournal
};